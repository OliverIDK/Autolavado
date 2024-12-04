import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from '@expo/vector-icons/Entypo';
import Divider from "../components/Divider";
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "../src/config/fb";

const Home = (props) => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const usuariosRef = collection(database, "usuarios");
          const q = query(usuariosRef, where("ida", "==", user.uid));

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setUserName(userData.name || "Usuario");
            });
          } else {
            console.log("No se encontró el usuario con ese ID.");
            setUserName("Usuario");
          }
        } else {
          console.log("No hay un usuario autenticado.");
          setUserName("Usuario");
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        setUserName("Usuario");
      }
    };

    fetchUserName();
  }, []);

  return (
    <View style={styles.container}>
      
      <Text style={styles.welcomeText}>Hola, {userName}</Text>
      
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
