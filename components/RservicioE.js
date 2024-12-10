import React, { useEffect, useState } from "react";
import { StyleSheet, Modal, View, Text, Button, Image, ScrollView, Alert } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { AntDesign } from "@expo/vector-icons";
import { deleteDoc, doc, getDocs, collection, getDoc } from "firebase/firestore";
import { database } from "../src/config/fb";
import { Card, IconButton } from "react-native-paper";

const imageMap = {
  carroChico: require("../src/Assets/iconosVehiculos/carroChico.png"),
  carroGrande: require("../src/Assets/iconosVehiculos/carroGrande.png"),
  carroMediano: require("../src/Assets/iconosVehiculos/carroMediano.png"),
  taxiUber: require("../src/Assets/iconosVehiculos/taxi.png"),
  moto: require("../src/Assets/iconosVehiculos/moto.png"),
  cuatri: require("../src/Assets/iconosVehiculos/cuatri.png"),
  racer: require("../src/Assets/iconosVehiculos/racer.png"),
};

const RservicioE = ({ id, total, usuario, placas, color, tipoVehiculo, fecha }) => {
  const [imageSource, setImageSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, "tiposDeVehiculos"));
        let imageKey = null;
        querySnapshot.forEach((doc) => {
          if (doc.data().name === tipoVehiculo) {
            imageKey = doc.data().imagen;
          }
        });
        setImageSource(imageMap[imageKey] || require("../src/Assets/caroficial.png"));
      } catch (error) {
        console.error("Error al obtener la imagen:", error);
        setImageSource(require("../src/Assets/caroficial.png"));
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [tipoVehiculo]);

  const handleViewDetails = async () => {
    try {
      const docRef = doc(database, "RegistroServicios", id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const serviceData = docSnap.data();
        const serviciosDetails = serviceData.servicios.map((servicio, index) => {
          return `${index + 1}. ${servicio.nombre} - $${servicio.precio}`;
        }).join('\n');
        
        const detalles = {
          usuario: serviceData.usuario || 'N/A',
          vehiculo: serviceData.vehiculo || 'N/A',
          modelo: serviceData.modelo || 'N/A',
          placas: serviceData.placas || 'N/A',
          extras: serviceData.extras || 0,
          fecha: new Date(serviceData.fecha).toLocaleString() || 'N/A',
          servicios: serviciosDetails || 'Ninguno',
          total: `$${serviceData.total || 'N/A'}`,
        };

        const detailsArray = [
          `Empleado: ${detalles.usuario}`,
          `Vehículo: ${detalles.vehiculo}`,
          `Modelo: ${detalles.modelo}`,
          `Placas: ${detalles.placas}`,
          `Fecha: ${detalles.fecha}`,
          `Servicios:\n${detalles.servicios}`,
          `Extras: ${detalles.extras}`,
          `Total: ${detalles.total}`,
        ];

        setModalContent(detailsArray.join('\n\n'));
        setModalVisible(true);
      } else {
        setModalContent('No se encontró el servicio.');
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error al obtener los detalles del servicio:", error);
      setModalContent('Hubo un problema al obtener los detalles.');
      setModalVisible(true);
    }
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
    return <Text>Cargando registros...</Text>;
  }

  return (
    <Card style={styles.card}>
      <Card.Title
        title={usuario} 
        subtitle={(
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>${total}</Text>
            <Text style={styles.subtitleText}>{placas}</Text>
            <Text style={styles.subtitleText}>{tipoVehiculo}</Text>
            <View style={styles.colorCircleContainer}>
              <View style={[styles.colorCircle, { backgroundColor: color.toLowerCase() }]} />
            </View>
          </View>
        )}
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
              <MenuOption onSelect={handleViewDetails}>
                <View style={styles.menuOptionContainer}>
                  <AntDesign name="info" size={20} color="#007bff" />
                  <Text style={styles.menuText}>Ver detalles</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      />
      <Card.Content>
        <Text style={styles.text}>{formatDate(fecha)}</Text>
      </Card.Content>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.scrollContainer}>
              <Text style={styles.modalText}>{modalContent}</Text>
            </ScrollView>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </Card>
  );
};

export default RservicioE;

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 320,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  scrollContainer: {
    maxHeight: 300,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
