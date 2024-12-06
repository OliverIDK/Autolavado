import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../src/config/fb";
import { useNavigation } from "@react-navigation/native";
import Vehiculos from "../components/Vehiculos";
import Icon from "@expo/vector-icons/Entypo";

const TipoVehiculo = () => {
  const navigation = useNavigation();
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const vehiculosCollection = collection(database, "tiposDeVehiculos");
    const unsubscribe = onSnapshot(
      vehiculosCollection,
      (snapshot) => {
        const vehiculosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          image: doc.data().imagen || "carroChico",
        }));
        setVehiculos(vehiculosData);
        setLoading(false);
      },
      (error) => {
        Alert.alert("Error", "No se pudieron cargar los vehículos.");
        console.error("Error al cargar vehículos:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando vehículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={vehiculos}
        renderItem={({ item }) => (
          <Vehiculos
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.btnAdd}
        onPress={() => navigation.navigate("AgregarVehiculo")}
      >
        <Icon name="circle-with-plus" size={65} color="#144E78" />
      </TouchableOpacity>
    </View>
  );
};

export default TipoVehiculo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  loadingText: {
    fontSize: 18,
    color: "#888",
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
