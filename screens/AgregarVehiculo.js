import React, { useState } from "react";
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
import { collection, addDoc } from "firebase/firestore";

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

const AgregarVehiculo = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const agregarVehiculo = async () => {
    if (!nombre || !imagen) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(database, "tiposDeVehiculos"), {
        name: nombre,
        imagen: imagen,
      });

      Alert.alert("Éxito", "Tipo de vehículo agregado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error al agregar vehículo:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al agregar el vehículo. Inténtalo de nuevo."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Tipo de Vehículo</Text>
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
      <TouchableOpacity style={styles.btnAdd} onPress={agregarVehiculo}>
        <Text style={styles.btnAddText}>Agregar Vehículo</Text>
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

export default AgregarVehiculo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  btnSelectImage: {
    backgroundColor: "#144E78",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  textButton: {
    color: "#fff",
    fontSize: 16,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  modalImage: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 10,
  },
  closeModalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#d9534f",
    borderRadius: 5,
  },
  closeModalText: {
    color: "#fff",
    fontSize: 16,
  },
  btnAdd: {
    backgroundColor: "#144E78",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  btnAddText: {
    color: "#fff",
    fontSize: 18,
  },
});
