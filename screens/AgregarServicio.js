import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { database } from "../src/config/fb";

const AgregarServicio = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [precios, setPrecios] = useState({});
  const [tiposVehiculo, setTiposVehiculo] = useState([]);

  useEffect(() => {
    const fetchTiposVehiculo = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(database, "tiposDeVehiculos")
        );
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
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del servicio"
        value={nombre}
        onChangeText={setNombre}
      />
      {tiposVehiculo.map((tipo) => (
        <View key={tipo.id} style={styles.precioContainer}>
          <Text>{tipo.name}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Precio para ${tipo.name}`}
            keyboardType="numeric"
            value={precios[tipo.name]}
            onChangeText={(value) =>
              setPrecios((prevPrecios) => ({
                ...prevPrecios,
                [tipo.name]: value,
              }))
            }
          />
        </View>
      ))}
      <Button
        title="Guardar Servicio"
        onPress={handleGuardarServicio}
        color="#144E78"
      />
    </ScrollView>
  );
};

export default AgregarServicio;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  precioContainer: {},
});
