import React from "react";
import { StyleSheet, Alert, Text, View, TouchableOpacity } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { database } from "../src/config/fb";

const Rservicio = ({ id, total, usuario, placas, color, tipoVehiculo }) => {
  const handleDelete = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este servicio?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteDoc(doc(database, "RegistroServicios", id));
              Alert.alert("Éxito", "Servicio eliminado correctamente");
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo eliminar el servicio. Inténtalo de nuevo."
              );
              console.error("Error al eliminar el servicio:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.productInfo}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Usuario: {usuario}</Text>
          <Text style={styles.text}>Placas: {placas}</Text>
          <Text style={styles.text}>Color: {color}</Text>
          <Text style={styles.text}>Tipo de Vehículo: {tipoVehiculo}</Text>
          <Text style={styles.text}>Total: ${total}</Text>
        </View>
        <Menu>
          <MenuTrigger>
            <Entypo
              name="dots-three-vertical"
              size={25}
              color="#888"
              style={styles.icon}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{ optionsContainer: { borderRadius: 15 } }}
          >
            <MenuOption onSelect={handleDelete}>
              <View style={styles.menuItem}>
                <AntDesign name="delete" size={20} color="#d9534f" />
                <Text style={styles.menuText}>Eliminar</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
};

export default Rservicio;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginVertical: 2,
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
    color: "#333",
  },
});
