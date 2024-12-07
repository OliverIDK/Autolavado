import React, { useEffect, useState } from "react";
import { StyleSheet, Alert, Text, View, Image } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { AntDesign } from "@expo/vector-icons";
import { deleteDoc, doc, getDocs, collection } from "firebase/firestore";
import { database } from "../src/config/fb";
import { Card, IconButton } from "react-native-paper";

// Mapa de imágenes local
const imageMap = {
  carroChico: require("../src/Assets/iconosVehiculos/carroChico.png"),
  carroGrande: require("../src/Assets/iconosVehiculos/carroGrande.png"),
  carroMediano: require("../src/Assets/iconosVehiculos/carroMediano.png"),
  taxiUber: require("../src/Assets/iconosVehiculos/taxi.png"),
  moto: require("../src/Assets/iconosVehiculos/moto.png"),
  cuatri: require("../src/Assets/iconosVehiculos/cuatri.png"),
  racer: require("../src/Assets/iconosVehiculos/racer.png"),
};

const Rservicio = ({ id, total, usuario, placas, color, tipoVehiculo, fecha }) => {
  const [imageSource, setImageSource] = useState(null); // Guardar la imagen
  const [loading, setLoading] = useState(true); // Indicar si estamos esperando la respuesta de Firestore

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Aquí buscamos el tipo de vehículo en Firestore
        const querySnapshot = await getDocs(collection(database, "tiposDeVehiculos"));
        let imageKey = null;

        // Buscar el nombre del tipo de vehículo y obtener la clave de la imagen
        querySnapshot.forEach((doc) => {
          if (doc.data().name === tipoVehiculo) {
            imageKey = doc.data().imagen; // Obtenemos la clave de la imagen desde Firestore
          }
        });

        // Si encontramos la clave en el mapa, la usamos, si no, imagen por defecto
        setImageSource(imageMap[imageKey] || require("../src/Assets/caroficial.png"));
      } catch (error) {
        console.error("Error al obtener la imagen:", error);
        setImageSource(require("../src/Assets/caroficial.png")); // Imagen por defecto en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [tipoVehiculo]);

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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} - ${hours}:${minutes}`;
  };

  if (loading) {
    return <Text>Cargando imagen...</Text>; // Mensaje mientras cargamos la imagen
  }

  return (
    <Card style={styles.card}>
      <Card.Title
        title={usuario} // Mostrar el nombre del usuario como título
        subtitle={
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>${total}</Text>
            <Text style={styles.subtitleText}>{placas}</Text>
            <Text style={styles.subtitleText}>{tipoVehiculo}</Text>
            <View style={styles.colorCircleContainer}>
              <View style={[styles.colorCircle, { backgroundColor: color.toLowerCase() }]} />
            </View>
          </View>
        }
        left={() => (
          <Image
            source={imageSource}
            style={styles.avatar}
            resizeMode="contain"
          />
        )}
        right={() => (
          <Menu>
            <MenuTrigger>
              <IconButton icon="dots-vertical" size={24} />
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: { borderRadius: 15 } }}>
              <MenuOption onSelect={() => handleDelete(usuario)}>
                <View style={styles.menuOptionContainer}>
                  <AntDesign name="delete" size={20} color="#d9534f" />
                  <Text style={styles.menuText}>Eliminar</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      />
      <Card.Content>
        <Text style={styles.text}>{formatDate(fecha)}</Text>
      </Card.Content>
    </Card>
  );
};

export default Rservicio;

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtitleText: {
    fontSize: 14,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 14,
    marginVertical: 2,
  },
  colorCircleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    borderColor: "black",
    borderWidth: 1,
  },
  menuOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 8,
  },
});
