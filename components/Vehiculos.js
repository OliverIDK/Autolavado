import React from "react";
import {
  StyleSheet,
  Alert,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
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

const imageMap = {
  carroChico: require("../src/Assets/iconosVehiculos/carroChico.png"),
  carroGrande: require("../src/Assets/iconosVehiculos/carroGrande.png"),
  carroMediano: require("../src/Assets/iconosVehiculos/carroMediano.png"),
  taxiUber: require("../src/Assets/iconosVehiculos/taxi.png"),
  moto: require("../src/Assets/iconosVehiculos/moto.png"),
  cuatri: require("../src/Assets/iconosVehiculos/cuatri.png"),
  racer: require("../src/Assets/iconosVehiculos/racer.png"),
};

const Vehiculos = ({ id, name, image }) => {
  const navigation = useNavigation();

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este vehículo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteDoc(doc(database, "tiposDeVehiculos", id));
              Alert.alert("Éxito", "Vehículo eliminado correctamente");
            } catch (error) {
              Alert.alert(
                "Error",
                "No se pudo eliminar el vehículo. Inténtalo de nuevo."
              );
              console.error("Error al eliminar el vehículo:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const imageSource =
    imageMap[image] || require("../src/Assets/iconosVehiculos/carroChico.png");

  return (
    <View style={styles.container}>
      <View style={styles.productInfo}>
        <Image source={imageSource} style={styles.cardImage} />
        <View style={styles.verticalLine}></View>
        <View style={styles.textContainer}>
          <Text style={styles.productoText}>
            {name || "Nombre no disponible"}
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
              onSelect={() => navigation.navigate("EditVehiculo", { id, name })}
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

export default Vehiculos;

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
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  verticalLine: {
    width: 1,
    height: 50,
    backgroundColor: "#ddd",
    marginHorizontal: 15,
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
