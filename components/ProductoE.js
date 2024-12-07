import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ImageBackground,
  } from "react-native";
  import React, { useState } from "react";
  import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from "react-native-popup-menu";
  import { AntDesign, Entypo } from "@expo/vector-icons";
  import { database } from "../src/config/fb";
  import { deleteDoc, doc, updateDoc } from "firebase/firestore";
  import { useNavigation } from "@react-navigation/native";
  
  const ProductoE = ({ id, producto, cantidad: initialCantidad, medida }) => {
    const [cantidad, setCantidad] = useState(initialCantidad);
    const [editing, setEditing] = useState(false);
    const navigation = useNavigation();
  
    const handleDelete = async () => {
      Alert.alert(
        "Confirmar eliminación",
        "¿Estás seguro de que deseas eliminar este producto?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: async () => {
              try {
                const productRef = doc(database, "inventario", id);
                await deleteDoc(productRef);
                console.log("Producto eliminado");
              } catch (error) {
                console.error("Error eliminando el producto: ", error);
              }
            },
          },
        ],
        { cancelable: true }
      );
    };
  
    const increaseCantidad = () => {
      setCantidad(cantidad + 1);
      setEditing(true);
    };
  
    const decreaseCantidad = () => {
      if (cantidad > 0) {
        setCantidad(cantidad - 1);
        setEditing(true);
      }
    };
  
    const confirmChange = async () => {
      try {
        const productRef = doc(database, "inventario", id);
        await updateDoc(productRef, { cantidad });
        Alert.alert("Éxito", "Cantidad actualizada correctamente");
        setEditing(false);
      } catch (error) {
        console.error("Error actualizando la cantidad:", error);
        Alert.alert("Error", "No se pudo actualizar la cantidad");
      }
    };
  
    const cancelChange = () => {
      setCantidad(initialCantidad);
      setEditing(false);
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.productInfo}>
          <ImageBackground
            style={styles.producto1}
            source={require("../assets/iconInventario.png")}
            resizeMode="contain"
          />
          <View style={styles.linea}></View>
          <View style={styles.textContainer}>
            <Text style={styles.productoText}>{producto}</Text>
            <View style={styles.cantidadContainer}>
              <TouchableOpacity onPress={decreaseCantidad} style={styles.button}>
                <AntDesign name="minus" size={16} color="#333" />
              </TouchableOpacity>
              <Text style={styles.cantidadText}>
                {cantidad} {medida}
              </Text>
              <TouchableOpacity onPress={increaseCantidad} style={styles.button}>
                <AntDesign name="plus" size={16} color="#333" />
              </TouchableOpacity>
              {editing && (
                <View style={styles.editOptions}>
                  <TouchableOpacity
                    onPress={confirmChange}
                    style={styles.confirmButton}
                  >
                    <AntDesign name="check" size={20} color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelChange}
                    style={styles.cancelButton}
                  >
                    <AntDesign name="close" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  export default ProductoE;
  
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      padding: 20,
      marginVertical: 1,
      backgroundColor: "#f9f9f9",
      borderRadius: 5,
    },
    productInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    producto1: {
      width: 48,
      height: 90,
      paddingLeft: 2,
    },
    linea: {
      width: 1,
      height: 80,
      backgroundColor: "#ddd",
      marginHorizontal: 20,
    },
    textContainer: {
      flex: 1,
    },
    productoText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    cantidadContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },
    cantidadText: {
      fontSize: 14,
      color: "#666",
      marginHorizontal: 10,
    },
    button: {
      padding: 5,
    },
    icon: {
      padding: 10,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    menuText: {
      marginLeft: 10,
      fontSize: 16,
    },
    editOptions: {
      flexDirection: "row",
      marginTop: 5,
      marginLeft: 10,
    },
    confirmButton: {
      marginRight: 10,
    },
    cancelButton: {
      marginLeft: 10,
    },
  });
  