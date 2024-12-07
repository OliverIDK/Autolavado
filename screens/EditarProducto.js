import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { database } from "../src/config/fb";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const data = [
  { label: "L", value: "L" },
  { label: "ml", value: "ml" },
  { label: "Kg", value: "Kg" },
  { label: "g", value: "g" },
];

const EditarProducto = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const { id, producto, cantidad, medida } = route.params;

  const [newProduct, setNewProduct] = useState({
    producto: producto || "",
    cantidad: cantidad.toString() || "",
    medida: medida || "L",
  });

  const [value, setValue] = useState(medida);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (id) {
      const getProductData = async () => {
        const docRef = doc(database, "inventario", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNewProduct({
            producto: data.producto,
            cantidad: data.cantidad.toString(),
            medida: data.medida,
          });
          setValue(data.medida);
        } else {
          Alert.alert("Error", "Producto no encontrado");
        }
      };
      
      getProductData();
    }
  }, [id]);

  const onSend = async () => {
    if (!newProduct.producto || !newProduct.cantidad || !value) {
      Alert.alert("Error", "Todos los campos deben ser completados.");
      return;
    }

    try {
      const productData = {
        ...newProduct,
        cantidad: Number(newProduct.cantidad),
        medida: value,
      };

      const productRef = doc(database, "inventario", id);
      await updateDoc(productRef, productData);

      Alert.alert("Éxito", "Producto actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo actualizar el producto. Inténtalo de nuevo."
      );
      console.error("Error al actualizar producto:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/iconInventario.png")}
        style={{ width: 100, height: 100, marginBottom: 20 }}
      />
      <TextInput
        style={styles.inputs}
        label="Nombre del Producto"
        placeholder="Ej. Shampoo para carro"
        value={newProduct.producto}
        onChangeText={(text) =>
          setNewProduct({ ...newProduct, producto: text })
        }
        mode="outlined"
        activeOutlineColor="#1A69DC"
        outlineColor="#ccc"
        outlineStyle={{
          borderRadius: 12,
          borderWidth: 1.5,
        }}
        theme={{
          colors: {
            background: "#fff",
            placeholder: "#555",
            text: "#555",
          },
        }}
      />
      <TextInput
        style={styles.inputs}
        label="Cantidad"
        placeholder="Ej. 10"
        keyboardType="number-pad"
        value={newProduct.cantidad.toString()}
        onChangeText={(text) =>
          setNewProduct({ ...newProduct, cantidad: text })
        }
        mode="outlined"
        activeOutlineColor="#1A69DC"
        outlineColor="#ccc"
        outlineStyle={{
          borderRadius: 12,
          borderWidth: 1.5,
        }}
        theme={{
          colors: {
            background: "#fff",
            placeholder: "#555",
            text: "#555",
          },
        }}
      />
      <View
        style={{
          width: "93%",
          height: 80,
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "black",
            fontWeight: "bold",
            textAlign: "center",
            alignContent: "center",
          }}
        >
          Medida:
        </Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "#1A69DC", borderWidth: 2 }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={[styles.iconStyle, isFocus && { tintColor: "#1A69DC" }]}
          data={data}
          search
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder="Selecciona la medida"
          searchPlaceholder="Buscar..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
          }}
        />
      </View>
      <TouchableOpacity style={styles.btnAddUser} onPress={onSend}>
        <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
          Actualizar Producto
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditarProducto;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: "140",
    alignItems: "center",
  },
  inputs: {
    width: "93%",
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    margin: 10,
    width: "80%",
    height: 50,
    fontSize: 20,
    backgroundColor: "white",
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1.5,
    borderColor: "#ccc",
    gap: 5,
  },
  btnAddUser: {
    width: "93%",
    height: 50,
    marginHorizontal: 15,
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#1A69DC",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
});
