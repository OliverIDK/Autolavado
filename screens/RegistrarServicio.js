import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput, PaperProvider } from "react-native-paper";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { database } from "../src/config/fb";
import { CheckBox } from "@rneui/themed";
import Icon from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

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
  const navigation = useNavigation();
  const [servicios, setServicios] = useState([]);
  const [checks, setChecks] = useState({});
  const [currentUserName, setCurrentUserName] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, "servicios"));
        const serviciosData = [];
        querySnapshot.forEach((doc) => {
          serviciosData.push({ id: doc.id, ...doc.data() });
        });
        setServicios(serviciosData);
        const initialChecks = serviciosData.reduce((acc, servicio) => {
          acc[servicio.id] = false;
          return acc;
        }, {});
        setChecks(initialChecks);
      } catch (error) {
        console.error("Error fetching servicios: ", error);
      }
    };

    const fetchCurrentUser = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userId = currentUser.uid;
        console.log("UID del usuario logueado:", userId);
      } else {
        console.log("No hay usuario autenticado.");
      }

      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.warn("No hay usuario autenticado.");
          return;
        }

        const userId = currentUser.uid;

        const userDoc = await getDocs(collection(database, "usuarios"));
        const currentUserDoc = userDoc.docs.find(
          (doc) => doc.data().ida === userId
        );

        if (currentUserDoc) {
          setCurrentUserName(currentUserDoc.data().name);
        } else {
          console.warn("Usuario no encontrado.");
        }
      } catch (error) {
        console.error("Error fetching current user: ", error);
      }
    };

    fetchServicios();
    fetchCurrentUser();
  }, []);

  const toggleService = (id) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [tiposDeVehiculos, setTiposDeVehiculos] = useState([]);
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");

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
  const [modalVisible, setModalVisible] = useState(false);
  const handleColorPress = (id) => {
    setSelectedColorId(id);
  };
  useEffect(() => {
    const fetchTiposDeVehiculos = async () => {
      try {
        const tiposRef = collection(database, "tiposDeVehiculos");
        const snapshot = await getDocs(tiposRef);

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

  const handlePress = (id) => {
    setSelectedButtonId(id);
  };

  const registrarServicio = async () => {
    if (!selectedButtonId || !selectedColorId || !text || !text2) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    const tipoVehiculoSeleccionado = tiposDeVehiculos[selectedButtonId]?.name;

    if (!tipoVehiculoSeleccionado) {
      Alert.alert("Error", "Por favor, selecciona un tipo de vehículo válido.");
      return;
    }
    const serviciosSeleccionados = servicios
      .filter((servicio) => checks[servicio.id])
      .map((servicio) => {
        const precioPorTipo =
          servicio.precios[tipoVehiculoSeleccionado]?.precio;
        return {
          id: servicio.id,
          nombre: servicio.nombre,
          precio: precioPorTipo || 0,
        };
      });

    if (serviciosSeleccionados.length === 0) {
      Alert.alert("Error", "Por favor, selecciona al menos un servicio.");
      return;
    }

    const extras = parseFloat(text3) || 0;
    const total =
      serviciosSeleccionados.reduce((acc, curr) => acc + curr.precio, 0) +
      extras;

    const nuevoServicio = {
      vehiculo: tipoVehiculoSeleccionado,
      color: ButtonColors.find((b) => b.id === selectedColorId)?.color,
      modelo: text,
      placas: text2,
      servicios: serviciosSeleccionados,
      extras,
      total,
      fecha: new Date().toISOString(),
      usuario: currentUserName,
    };

    try {
      const serviciosRef = collection(database, "RegistroServicios");
      await addDoc(serviciosRef, nuevoServicio);

      Alert.alert(
        "Servicio registrado",
        `Se registró el servicio con éxito.\nTotal: $${total.toFixed(2)}`
      );
      console.log("Servicio registrado en Firestore:", nuevoServicio);
      navigation.goBack();
    } catch (error) {
      console.error("Error al registrar el servicio:", error);
      Alert.alert("Error", "Hubo un problema al registrar el servicio.");
    }
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
          <View style={styles.containServicio}>
            <TouchableOpacity
              style={styles.btnServicios}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.txtServicios}>Selecciona los servicios</Text>
            </TouchableOpacity>
          </View>
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
              value={text2}
              onChangeText={setText2}
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
              label="Extras"
              placeholder="Ej. 23"
              value={text3}
              onChangeText={setText3}
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
                  onPress={() => handleColorPress(button.id)}
                  style={[
                    styles.btnColor,
                    {
                      backgroundColor: button.color,
                      borderWidth: selectedColorId === button.id ? 3 : 0.6,
                      borderColor:
                        selectedColorId === button.id ? "#1A69DC" : "#ccc",
                    },
                  ]}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.containServicio}>
            <TouchableOpacity
              style={[styles.btnRegistrarServicio, { marginBottom: 20 }]}
              onPress={registrarServicio}
            >
              <Text
                style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
              >
                Registrar Servicio
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.btnCerrarModal}
                onPress={() => setModalVisible(false)}
              >
                <Icon color="gray" size={25} name="circle-with-cross" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Selecciona los servicios</Text>
              {servicios.map((servicio) => (
                <CheckBox
                  key={servicio.id}
                  alignSelf="flex-start"
                  iconRight
                  title={servicio.nombre}
                  checked={checks[servicio.id]}
                  size={25}
                  onPress={() => toggleService(servicio.id)}
                  wrapperStyle={{
                    flexDirection: "row",
                    width: "100%",
                  }}
                  textStyle={{ flex: 1, textAlign: "left", fontSize: 16 }}
                />
              ))}
              <TouchableOpacity
                style={styles.btnRegistrarServicio}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text
                  style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
                >
                  Agregar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginTop: 5,
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
  btnServicios: {
    height: 50,
    width: "93%",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#B3D0FB",
    alignItems: "center",
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingTop: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    height: "50%",
  },
  modalTitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1A69DC",
    paddingLeft: 25,
  },
  btnCerrarModal: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  containServicio: {
    alignItems: "center",
  },
  btnRegistrarServicio: {
    marginTop: 15,
    width: "93%",
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
  inputPlacas: {
    marginBottom: 10,
  },
  txtTotal: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 30,
  },
  containTotal: {
    display: "flex",
  },
  txtServicios: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
});
