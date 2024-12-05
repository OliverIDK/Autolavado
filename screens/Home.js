import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { database } from "../src/config/fb"; // Importa el componente
import Rservicio from "../components/Rservicio";

const Home = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [registroServicios, setRegistroServicios] = useState([]); // Estado para almacenar los datos

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const usuariosRef = collection(database, "usuarios");
          const q = query(usuariosRef, where("ida", "==", user.uid));

          onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                const userData = doc.data();
                setUserName(userData.name || "Usuario");
              });
            } else {
              console.log("No se encontró el usuario con ese ID.");
              setUserName("Usuario");
            }
          });
        } else {
          console.log("No hay un usuario autenticado.");
          setUserName("Usuario");
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        setUserName("Usuario");
      }
    };

    const fetchRegistroServicios = () => {
      try {
        const registroRef = collection(database, "RegistroServicios");
        
        // Usar onSnapshot para escuchar cambios en tiempo real
        onSnapshot(registroRef, (querySnapshot) => {
          const servicios = [];
          querySnapshot.forEach((doc) => {
            servicios.push({ id: doc.id, ...doc.data() });
          });

          setRegistroServicios(servicios); // Actualiza el estado con los datos obtenidos
        });
      } catch (error) {
        console.error("Error al obtener registros de servicios:", error);
      }
    };

    fetchUserName();
    fetchRegistroServicios(); // Llama a la función para obtener los datos en tiempo real
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hola, {userName}</Text>
      <ScrollView>
        {registroServicios.map((servicio) => (
          <Rservicio
            key={servicio.id}
            id={servicio.id}
            total={servicio.total} // Total cobrado
            usuario={servicio.usuario} // Usuario actual
            placas={servicio.placas}
            color={servicio.color}
            tipoVehiculo={servicio.tipoVehiculo} // Tipo de vehículo
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.btnAdd}
        onPress={() => navigation.navigate("RegistrarServicio")}
      >
        <Icon name="circle-with-plus" size={65} color="#144E78" />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
    padding: 20,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  btnAdd: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 90,
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
