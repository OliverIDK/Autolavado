import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
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
    backgroundColor: "#F8F8F8",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
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
    height: 120,
    width: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    height: 120,
    width: 120, 
    borderRadius: 60,
    backgroundColor: "#EAEAEA",
  },
  plusIcon: {
    fontSize: 40,
    color: "#666",
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    shadowRadius: 5,
  },
  btnAddText: {
    color: "#fff",
    fontSize: 18,
  },
});
