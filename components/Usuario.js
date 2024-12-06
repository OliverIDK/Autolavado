import React from "react";
import { StyleSheet, Alert, Image, View } from "react-native";
import { Card, Avatar, IconButton, Divider, Text } from "react-native-paper";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { AntDesign } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { database } from "../src/config/fb";
import { useNavigation } from "@react-navigation/native";

const Usuario = ({ id, name, rol, email }) => {
  const navigation = useNavigation();

  const ImageRol = (rol) => {
    return rol === "Encargado"
      ? require("../assets/encargado.png")
      : require("../assets/empleado.png");
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar a ${name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(database, "usuarios", id));
              Alert.alert("Éxito", "Usuario eliminado correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el usuario.");
              console.error("Error al eliminar el usuario:", error);
            }
          },
        },
      ]
    );
  };

  const imagenUsuario = ImageRol(rol);

  return (
    <Card style={styles.card}>
      <Card.Title
        title={name}
        subtitle={rol}
        left={(props) => (
          <Avatar.Image {...props} size={40} source={imagenUsuario} />
        )}
        right={(props) => (
          <Menu>
            <MenuTrigger>
              <IconButton {...props} icon="dots-vertical" />
            </MenuTrigger>
            <MenuOptions
              customStyles={{ optionsContainer: { borderRadius: 15 } }}
            >
              <MenuOption
                onSelect={() =>
                  navigation.navigate("EditUsuario", { id, name, email, rol })
                }
              >
                <View style={styles.menuOptionContainer}>
                  <AntDesign name="edit" size={20} color="#144E78" />
                  <Text style={styles.menuText}>Editar</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={handleDelete}>
                <View style={styles.menuOptionContainer}>
                  <AntDesign name="delete" size={20} color="#d9534f" />
                  <Text style={styles.menuText}>Eliminar</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      />
    </Card>
  );
};

export default Usuario;

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    backgroundColor: "#F0F0F0",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 8,
  },
  menuOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
