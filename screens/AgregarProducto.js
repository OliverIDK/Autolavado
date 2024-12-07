import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { database } from "../src/config/fb";
import { collection, addDoc } from "firebase/firestore";

const data = [
  { label: "L", value: "L" },
  { label: "ml", value: "ml" },
  { label: "Kg", value: "Kg" },
  { label: "g", value: "g" },
];

const AgregarProducto = () => {
  const [newProduct, setNewProduct] = useState({
    producto: "",
    cantidad: "",
    medida: "L",
  });

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const navigation = useNavigation();

  const onSend = async () => {
    // Validación de campos vacíos
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
      await addDoc(collection(database, "inventario"), productData);
      Alert.alert("Éxito", "Producto agregado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo agregar el producto. Inténtalo de nuevo."
      );
      console.error("Error al agregar producto:", error);
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
          Guardar Producto
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AgregarProducto;

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
  txtSelectRol: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 15,
    alignSelf: "flex-start",
  },
  containRol: {
    display: "flex",
    width: "100%",
    height: 125,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
    gap: 20,
  },
  btnRol: {
    width: 150,
    height: 115,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
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
