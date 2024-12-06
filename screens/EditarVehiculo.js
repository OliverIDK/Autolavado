import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { database } from "../src/config/fb";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const imagenes = [
  {
    id: "carroChico",
    uri: require("../src/Assets/iconosVehiculos/carroChico.png"),
  },
  {
    id: "carroGrande",
    uri: require("../src/Assets/iconosVehiculos/carroGrande.png"),
  },
  {
    id: "carroMediano",
    uri: require("../src/Assets/iconosVehiculos/carroMediano.png"),
  },
  { id: "taxiUber", uri: require("../src/Assets/iconosVehiculos/taxi.png") },
  { id: "moto", uri: require("../src/Assets/iconosVehiculos/moto.png") },
  { id: "cuatri", uri: require("../src/Assets/iconosVehiculos/cuatri.png") },
  { id: "racer", uri: require("../src/Assets/iconosVehiculos/racer.png") },
];

const EditarVehiculo = ({ route, navigation }) => {
  const { id } = route.params;
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const vehiculoRef = doc(database, "tiposDeVehiculos", id);
        const vehiculoSnap = await getDoc(vehiculoRef);
        if (vehiculoSnap.exists()) {
          const data = vehiculoSnap.data();
          setNombre(data.name);
          setImagen(data.imagen);
        } else {
          Alert.alert("Error", "El vehículo no existe.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error al cargar datos del vehículo:", error);
        Alert.alert("Error", "No se pudo cargar la información del vehículo.");
      }
    };

    cargarDatos();
  }, [id]);

  const actualizarVehiculo = async () => {
    if (!nombre || !imagen) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const vehiculoRef = doc(database, "tiposDeVehiculos", id);
      await updateDoc(vehiculoRef, {
        name: nombre,
        imagen: imagen,
      });

      Alert.alert("Éxito", "Tipo de vehículo actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al actualizar el vehículo. Inténtalo de nuevo."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Tipo de Vehículo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del vehículo"
        value={nombre}
        onChangeText={setNombre}
      />
      <TouchableOpacity
        style={styles.btnSelectImage}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textButton}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {imagen && (
        <Image
          source={imagenes.find((img) => img.id === imagen)?.uri}
          style={styles.selectedImage}
        />
      )}
      <TouchableOpacity style={styles.btnAdd} onPress={actualizarVehiculo}>
        <Text style={styles.btnAddText}>Actualizar Vehículo</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Imagen</Text>
            <View style={styles.imageContainer}>
              {imagenes.map((img) => (
                <TouchableOpacity
                  key={img.id}
                  onPress={() => {
                    setImagen(img.id);
                    setModalVisible(false);
                  }}
                >
                  <Image source={img.uri} style={styles.modalImage} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeModalButton}
            >
              <Text style={styles.closeModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditarVehiculo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  btnSelectImage: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  textButton: {
    color: "#fff",
    textAlign: "center",
  },
  selectedImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  btnAdd: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
  },
  btnAddText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalImage: {
    width: 60,
    height: 60,
    margin: 5,
  },
  closeModalButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
  },
  closeModalText: {
    color: "#fff",
    textAlign: "center",
  },
});
