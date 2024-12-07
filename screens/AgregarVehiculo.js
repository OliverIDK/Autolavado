import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper"; // Importa el TextInput de react-native-paper
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

      {/* Botón de imagen y contenedor arriba */}
      <TouchableOpacity
        style={styles.btnSelectImage}
        onPress={() => setModalVisible(true)}
      >
        {imagen ? (
          <Image
            source={imagenes.find((img) => img.id === imagen)?.uri}
            style={styles.selectedImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Campo de texto para nombre del vehículo */}
      <TextInput
        style={styles.input}
        label="Nombre del vehículo"
        placeholder="Ej. Carro Compacto"
        value={nombre}
        onChangeText={setNombre}
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
    alignItems: "center", // Centra todo el contenido en el contenedor
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%",
    marginBottom: 20,
  },
  btnSelectImage: {
    justifyContent: "center",
    alignItems: "center",
    height: 120, // Aumentamos el tamaño
    width: 120, // Aumentamos el tamaño
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 60, // Hace el borde circular
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    height: 120, // Igual que la imagen
    width: 120, // Igual que la imagen
    borderRadius: 60, // Hace el hueco circular
    backgroundColor: "#EAEAEA", // Color de fondo para el hueco
  },
  plusIcon: {
    fontSize: 40, // Aumentamos el tamaño del "+" para que sea más visible
    color: "#666",
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Imagen circular
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
    marginTop: 15,
    width: "100%",
    height: 50,
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#1A69DC",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5, // Puedes ajustar este valor según necesites más espacio
  },
  btnAddText: {
    color: "#fff",
    fontSize: 18,
  },
});
