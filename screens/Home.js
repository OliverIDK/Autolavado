import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { database } from "../src/config/fb";
import Rservicio from "../components/Rservicio";

const Home = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [registroServicios, setRegistroServicios] = useState([]);
  const [totalDia, setTotalDia] = useState(0);

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
              setUserName("Usuario");
            }
          });
        } else {
          setUserName("Usuario");
        }
      } catch (error) {
        setUserName("Usuario");
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchRegistroServicios = () => {
      try {
        const registroRef = collection(database, "RegistroServicios");

        onSnapshot(registroRef, (querySnapshot) => {
          const servicios = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            servicios.push({ id: doc.id, ...data });
          });

          setRegistroServicios(servicios);
        });
      } catch (error) {
        console.error("Error al obtener registros de servicios:", error);
      }
    };

    fetchRegistroServicios();
  }, []);

  useEffect(() => {
    const calcularTotalDia = () => {
      const hoy = new Date();
      const hoyInicio = new Date(hoy.setHours(0, 0, 0, 0)); // Establecer el inicio del día
      const hoyFin = new Date(hoy.setHours(23, 59, 59, 999)); // Establecer el fin del día

      let total = 0;
      const serviciosDelDia = registroServicios.filter((servicio) => {
        const fechaServicio = new Date(servicio.fecha);
        return fechaServicio >= hoyInicio && fechaServicio <= hoyFin;
      });

      serviciosDelDia.forEach((servicio) => {
        total += parseFloat(servicio.total);
      });

      setTotalDia(total);
    };

    calcularTotalDia();
  }, [registroServicios]);

  // Filtramos los servicios para el día actual
  const serviciosDelDia = registroServicios.filter((servicio) => {
    const fechaServicio = new Date(servicio.fecha);
    const hoy = new Date();
    const hoyInicio = new Date(hoy.setHours(0, 0, 0, 0)); // Establecer el inicio del día
    const hoyFin = new Date(hoy.setHours(23, 59, 59, 999)); // Establecer el fin del día
    return fechaServicio >= hoyInicio && fechaServicio <= hoyFin;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hola, {userName}</Text>
      <Text style={styles.totalText}>Total de hoy: ${totalDia.toFixed(2)}</Text>
      <ScrollView>
        {serviciosDelDia.map((servicio) => {
          return (
            <Rservicio
              key={servicio.id}
              id={servicio.id}
              total={servicio.total}
              usuario={servicio.usuario}
              placas={servicio.placas}
              color={servicio.color}
              tipoVehiculo={servicio.vehiculo}
              fecha={servicio.fecha}
            />
          );
        })}
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
  totalText: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#144E78",
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

export default Home;
