import React from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { deleteDoc, doc } from "firebase/firestore";
import { database } from "../src/config/fb";

const Servicio = ({ id, nombre }) => {
  const navigation = useNavigation();

  const handleDelete = async () => {
    if (!id) {
      Alert.alert("Error", "El ID del servicio no está disponible.");
      return;
    }

    console.log("ID del servicio:", id);

    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este servicio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteDoc(doc(database, "servicios", id));
              Alert.alert("Éxito", "Servicio eliminado correctamente");
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo eliminar el servicio. Inténtalo de nuevo."
              );
              console.error("Error al eliminar el servicio:", error.message);
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
          <Text style={styles.productoText}>
            {nombre || "Nombre no disponible"}
          </Text>
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
            <MenuOption
              onSelect={() =>
                navigation.navigate("EditServicio", { id, nombre })
              }
            >
              <View style={styles.menuItem}>
                <AntDesign name="edit" size={20} color="#144E78" />
                <Text style={styles.menuText}>Editar</Text>
              </View>
            </MenuOption>
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

export default Servicio;

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
  productoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
});
