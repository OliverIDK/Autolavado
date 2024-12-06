import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { database } from "../src/config/fb";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

const EditarProducto = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, producto, cantidad, medida } = route.params;

  const [newProducto, setNewProducto] = useState(producto);
  const [newCantidad, setNewCantidad] = useState(cantidad.toString());
  const [newMedida, setNewMedida] = useState(medida);

  const handleUpdateProduct = async () => {
    if (!newProducto || !newCantidad || !newMedida) {
      Alert.alert("Error", "Todos los campos son requeridos");
      return;
    }

    try {
      const productRef = doc(database, "inventario", id);
      await updateDoc(productRef, {
        producto: newProducto,
        cantidad: parseInt(newCantidad),
        medida: newMedida,
      });
      Alert.alert("Éxito", "Producto actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo actualizar el producto. Inténtalo de nuevo."
      );
      console.error("Error al actualizar el producto:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>

      <TextInput
        style={styles.input}
        placeholder="Producto"
        value={newProducto}
        onChangeText={setNewProducto}
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={newCantidad}
        onChangeText={setNewCantidad}
      />
      <TextInput
        style={styles.input}
        placeholder="Medida"
        value={newMedida}
        onChangeText={setNewMedida}
      />

      <TouchableOpacity style={styles.btnAdd} onPress={handleUpdateProduct}>
        <Text style={styles.btnText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditarProducto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  btnAdd: {
    width: "100%",
    height: 50,
    backgroundColor: "#144E78",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
