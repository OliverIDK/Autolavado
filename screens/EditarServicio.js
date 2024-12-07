import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import { doc, updateDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { database } from "../src/config/fb";

const EditarServicio = ({ route, navigation }) => {
  const { id } = route.params;
  const [nombre, setNombre] = useState("");
  const [precios, setPrecios] = useState({});
  const [tiposVehiculo, setTiposVehiculo] = useState([]);

  useEffect(() => {
    const fetchTiposVehiculo = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, "tiposDeVehiculos"));
        const tipos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTiposVehiculo(tipos);
      } catch (error) {
        console.error("Error al obtener los tipos de vehículo:", error);
        Alert.alert("Error", "No se pudieron cargar los tipos de vehículo.");
      }
    };

    const fetchServicio = async () => {
      try {
        const docRef = doc(database, "servicios", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const servicio = docSnap.data();
          setNombre(servicio.nombre || "");
          setPrecios(servicio.precios || {});
        } else {
          Alert.alert("Error", "El servicio no existe.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error al obtener el servicio:", error);
        Alert.alert("Error", "No se pudo cargar el servicio.");
      }
    };

    fetchTiposVehiculo();
    fetchServicio();
  }, [id]);

  const handleGuardarCambios = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre del servicio no puede estar vacío.");
      return;
    }

    const preciosValidos = Object.values(precios).every(
      (tipoVehiculo) => tipoVehiculo.precio && !isNaN(tipoVehiculo.precio)
    );
    if (!preciosValidos) {
      Alert.alert("Error", "Todos los precios deben ser números válidos.");
      return;
    }

    try {
      const docRef = doc(database, "servicios", id);
      await updateDoc(docRef, {
        nombre,
        precios: Object.keys(precios).reduce((acc, tipoVehiculo) => {
          acc[tipoVehiculo] = { precio: precios[tipoVehiculo].precio };
          return acc;
        }, {}),
      });

      Alert.alert("Éxito", "Servicio actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar el servicio:", error);
      Alert.alert("Error", "Hubo un problema al actualizar el servicio.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.tipoText}>Servicio</Text>
        <TextInput
          style={styles.input}
          label="Nombre del servicio"
          placeholder="Ej. Lavado Completo"
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
        {tiposVehiculo.map((tipo) => (
          <View key={tipo.id} style={styles.precioContainer}>
            <Text style={styles.tipoText}>{tipo.name}</Text>
            <TextInput
              style={styles.input}
              label={`Precio para ${tipo.name}`}
              placeholder="Precio"
              keyboardType="numeric"
              value={precios[tipo.name]?.precio?.toString() || ""}
              onChangeText={(value) => {
                const precio = value ? parseFloat(value) : "";
                setPrecios((prevPrecios) => ({
                  ...prevPrecios,
                  [tipo.name]: { precio },
                }));
              }}
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
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.btnSave} onPress={handleGuardarCambios}>
      <Text
                style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
              >
                Editar
              </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditarServicio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding:20
  },
  scrollView: {
    padding: 20,
  },
  input: {
    width: "100%", // Esto asegura que el input ocupe el mismo ancho que el botón
    fontSize: 16,
    marginBottom: 15,
  },
  precioContainer: {
    marginBottom: 20,
  },
  tipoText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  btnSave: {
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
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
