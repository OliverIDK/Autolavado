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
import { collection, addDoc, getDocs } from "firebase/firestore";
import { database } from "../src/config/fb";

const AgregarServicio = ({ navigation }) => {
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

        const preciosIniciales = tipos.reduce((acc, tipo) => {
          acc[tipo.name] = "";
          return acc;
        }, {});
        setPrecios(preciosIniciales);
      } catch (error) {
        console.error("Error al obtener los tipos de vehículo:", error);
        Alert.alert("Error", "No se pudieron cargar los tipos de vehículo.");
      }
    };

    fetchTiposVehiculo();
  }, []);

  const handleGuardarServicio = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre del servicio no puede estar vacío.");
      return;
    }

    const preciosValidos = Object.values(precios).every(
      (precio) => !isNaN(precio) && precio.trim() !== ""
    );
    if (!preciosValidos) {
      Alert.alert("Error", "Todos los precios deben ser números válidos.");
      return;
    }

    try {
      await addDoc(collection(database, "servicios"), {
        nombre,
        precios: Object.keys(precios).reduce((acc, tipoVehiculo) => {
          acc[tipoVehiculo] = { precio: parseFloat(precios[tipoVehiculo]) };
          return acc;
        }, {}),
      });

      Alert.alert("Éxito", "Servicio agregado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar el servicio:", error);
      Alert.alert("Error", "Hubo un problema al guardar el servicio.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
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
              value={precios[tipo.name]}
              onChangeText={(value) =>
                setPrecios((prevPrecios) => ({
                  ...prevPrecios,
                  [tipo.name]: value,
                }))
              }
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
      <TouchableOpacity style={styles.btnSave} onPress={handleGuardarServicio}>
        <Text style={styles.btnText}>Guardar Servicio</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AgregarServicio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 20,
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
    width: "100%", // El botón ahora tiene el mismo width que los inputs
    height: 50,
    backgroundColor: "#144E78",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, // Asegura que el botón tenga espacio arriba
    marginBottom: 40, // Puedes ajustar este valor según necesites más espacio
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
