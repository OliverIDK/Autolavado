import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput, PaperProvider } from "react-native-paper";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../src/config/fb"; // Asegúrate de que Firestore esté correctamente configurado

// Mapeo de imágenes de los vehículos (imagen normal y seleccionada)
const imageMap = {
  carroChico: {
    default: require("../src/Assets/iconosVehiculos/carroChico.png"),
    selected: require("../src/Assets/iconosVehiculos/carroChicoSelected.png"),
  },
  carroMediano: {
    default: require("../src/Assets/iconosVehiculos/carroMediano.png"),
    selected: require("../src/Assets/iconosVehiculos/carroMedianoSelected.png"),
  },
  carroGrande: {
    default: require("../src/Assets/iconosVehiculos/carroGrande.png"),
    selected: require("../src/Assets/iconosVehiculos/carroGrandeSelected.png"),
  },
  taxiUber: {
    default: require("../src/Assets/iconosVehiculos/taxi.png"),
    selected: require("../src/Assets/iconosVehiculos/taxiSelected.png"),
  },
  moto: {
    default: require("../src/Assets/iconosVehiculos/moto.png"),
    selected: require("../src/Assets/iconosVehiculos/motoSelected.png"),
  },
  cuatri: {
    default: require("../src/Assets/iconosVehiculos/cuatrimoto.png"),
    selected: require("../src/Assets/iconosVehiculos/cuatrimotoSelected.png"),
  },
  racer: {
    default: require("../src/Assets/iconosVehiculos/racer.png"),
    selected: require("../src/Assets/iconosVehiculos/racerSelected.png"),
  },
};

const RegistrarServicio = () => {
  const [tiposDeVehiculos, setTiposDeVehiculos] = useState([]); // Datos de los vehículos de Firestore
  const [selectedButtonId, setSelectedButtonId] = useState(null); // Estado para el botón seleccionado
  const [text, setText] = useState(""); // Estado para el campo de texto (placas)
  const ButtonColors = [
    { id: 1, color: "white" },
    { id: 2, color: "lightgray" },
    { id: 3, color: "gray" },
    { id: 4, color: "black" },
    { id: 5, color: "red" },
    { id: 6, color: "blue" },
    { id: 7, color: "yellow" },
    { id: 8, color: "orange" },
    { id: 9, color: "pink" },
  ];
  const [selectedColorId, setSelectedColorId] = useState(null);

  // Manejo de selección de color
  const handleColorPress = (id) => {
    setSelectedColorId(id);
  };
  // Obtener los datos de Firestore
  useEffect(() => {
    const fetchTiposDeVehiculos = async () => {
      try {
        const tiposRef = collection(database, "tiposDeVehiculos");
        const snapshot = await getDocs(tiposRef);

        // Mapear y filtrar solo aquellos tipos de vehículos con nombre e imagen válidos
        const tipos = snapshot.docs.map((doc) => doc.data());
        const filteredTipos = tipos.filter(
          (vehicle) => vehicle.name && vehicle.imagen
        );

        setTiposDeVehiculos(filteredTipos);
      } catch (error) {
        console.log("Error al obtener los tipos de vehículos: ", error);
      }
    };

    fetchTiposDeVehiculos();
  }, []);

  // Manejar la selección del botón
  const handlePress = (id) => {
    setSelectedButtonId(id);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.textos}>Selecciona un vehículo</Text>
          <View style={styles.containVehiculo}>
            <ScrollView horizontal contentContainerStyle={styles.scrollView}>
              {tiposDeVehiculos.map((vehicle, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.btnVehiculo,
                    {
                      backgroundColor:
                        selectedButtonId === index ? "#1A69DC" : "#E9E9E9",
                    },
                  ]}
                  onPress={() => handlePress(index)}
                >
                  <Image
                    source={
                      selectedButtonId === index
                        ? imageMap[vehicle.imagen]?.selected
                        : imageMap[vehicle.imagen]?.default
                    }
                    style={styles.image}
                  />
                  <Text
                    style={[
                      styles.txtVehiculo,
                      {
                        color:
                          selectedButtonId === index ? "#FFFFFF" : "#6B6B6B",
                      },
                    ]}
                  >
                    {vehicle.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Campo de entrada de texto para las placas */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputPlacas}
              label="Modelo"
              placeholder="Ej. Mercedes"
              value={text}
              onChangeText={setText}
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
            <TextInput
              style={styles.inputPlacas}
              label="Placas"
              placeholder="Ej. JW-60-261"
              value={text}
              onChangeText={setText}
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
          <Text style={styles.textos}>Selecciona el color</Text>
          <View style={styles.containColor}>
            <ScrollView
              horizontal
              contentContainerStyle={{
                gap: 12,
                paddingHorizontal: 10,
              }}
            >
              {ButtonColors.map((button) => (
                <TouchableOpacity
                  key={button.id}
                  onPress={() => handleColorPress(button.id)} // Maneja la selección de color
                  style={[
                    styles.btnColor,
                    {
                      backgroundColor: button.color,
                      borderWidth: selectedColorId === button.id ? 3 : 0.6, // Borde dinámico
                      borderColor:
                        selectedColorId === button.id ? "#1A69DC" : "#ccc", // Color del borde
                    },
                  ]}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default RegistrarServicio;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  containVehiculo: {
    display: "flex",
    width: "100%",
    height: 125,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  btnVehiculo: {
    width: 150,
    height: 115,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  txtVehiculo: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: 70,
    height: 70,
  },
  scrollView: {
    flexDirection: "row",
  },
  textos: {
    marginHorizontal: 15,
    fontWeight: "bold",
  },
  inputContainer: {
    marginHorizontal: 15,
  },
  containColor: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    flexDirection: "row",
    marginVertical: 15,
    marginBottom: 5,
  },
  btnColor: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderColor: "#ccc",
    borderWidth: 0.8,
    marginHorizontal: 6,
  },
});
