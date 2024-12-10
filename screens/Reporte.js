import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../src/config/fb";
import Rservicio from "../components/Rservicio";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const Reporte = () => {
  const navigation = useNavigation();
  const [registroServicios, setRegistroServicios] = useState([]);
  const [totalDia, setTotalDia] = useState(0);
  const [rangoTiempo, setRangoTiempo] = useState("dia");

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
      let total = 0;
      const hoy = new Date();

      const serviciosFiltrados = registroServicios.filter((servicio) => {
        const fechaServicio = new Date(servicio.fecha);
        let fechaLimite;
        const hoyCopia = new Date(hoy);

        if (rangoTiempo === "dia") {
          fechaLimite = new Date(hoyCopia.setHours(0, 0, 0, 0));
        } else if (rangoTiempo === "7dias") {
          fechaLimite = new Date(hoyCopia.setDate(hoyCopia.getDate() - 7));
        } else if (rangoTiempo === "mes") {
          fechaLimite = new Date(hoyCopia.setMonth(hoyCopia.getMonth() - 1));
        } else {
          return true;
        }

        return fechaServicio >= fechaLimite;
      });

      serviciosFiltrados.forEach((servicio) => {
        total += parseFloat(servicio.total);
      });

      setTotalDia(total);
    };

    calcularTotalDia();
  }, [registroServicios, rangoTiempo]);
  const serviciosFiltrados = registroServicios.filter((servicio) => {
    const fechaServicio = new Date(servicio.fecha);
    const hoy = new Date();
    const hoyCopia = new Date(hoy);
    let fechaLimite;

    if (rangoTiempo === "dia") {
      fechaLimite = new Date(hoyCopia.setHours(0, 0, 0, 0));
    } else if (rangoTiempo === "7dias") {
      fechaLimite = new Date(hoyCopia.setDate(hoyCopia.getDate() - 7));
    } else if (rangoTiempo === "mes") {
      fechaLimite = new Date(hoyCopia.setMonth(hoyCopia.getMonth() - 1));
    } else {
      return true;
    }

    return fechaServicio >= fechaLimite;
  });
  const diasSemana = ["D", "L", "M", "M", "J", "V", "S"];
  const totalesPorDia = new Array(7).fill(0);

  const serviciosUltimos7Dias = registroServicios.filter((servicio) => {
    const fechaServicio = new Date(servicio.fecha);
    const hoy = new Date();
    const hoyCopia = new Date(hoy);
    const fechaLimite = new Date(hoyCopia.setDate(hoyCopia.getDate() - 7));
    return fechaServicio >= fechaLimite;
  });

  serviciosUltimos7Dias.forEach((servicio) => {
    const fechaServicio = new Date(servicio.fecha);
    const indiceDia = fechaServicio.getDay();
    totalesPorDia[indiceDia] += parseFloat(servicio.total);
  });
  const chartData = {
    labels: diasSemana,
    datasets: [
      {
        data: totalesPorDia,
      },
    ],
  };
  const getButtonStyle = (option) => {
    return rangoTiempo === option
      ? [styles.button, styles.buttonSelected]
      : [styles.button, styles.buttonOutline];
  };

  const getButtonTextStyle = (option) => {
    return rangoTiempo === option
      ? [styles.buttonText, { color: "#fff" }]
      : [styles.buttonText, { color: "#144E78" }];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Gráfica de Servicios (Últimos 7 días)
      </Text>
      <Text style={styles.totalText}>Total: ${totalDia.toFixed(2)}</Text>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 10}
          height={220}
          chartConfig={{
            backgroundColor: "#1E2923",
            backgroundGradientFrom: "#08130D",
            backgroundGradientTo: "#1E2923",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 10,
            borderRadius: 16,
          }}
          barPercentage={0.7}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={getButtonStyle("dia")}
          onPress={() => setRangoTiempo("dia")}
        >
          <Text style={getButtonTextStyle("dia")}>Hoy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("7dias")}
          onPress={() => setRangoTiempo("7dias")}
        >
          <Text style={getButtonTextStyle("7dias")}>Últimos 7 días</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("mes")}
          onPress={() => setRangoTiempo("mes")}
        >
          <Text style={getButtonTextStyle("mes")}>Último mes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("todos")}
          onPress={() => setRangoTiempo("todos")}
        >
          <Text style={getButtonTextStyle("todos")}>Todos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {serviciosFiltrados.map((servicio) => {
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
        onPress={() => navigation.navigate("ReporteF")}
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
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#144E78",
  },
  buttonSelected: {
    backgroundColor: "#144E78",
  },
  buttonText: {
    fontSize: 16,
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

export default Reporte;
