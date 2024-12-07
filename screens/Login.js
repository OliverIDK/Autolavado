import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "../src/config/fb";
import Icon from "@expo/vector-icons/Entypo";

const auth = getAuth();

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const logueo = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    setLoading(true); 

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const usuariosRef = collection(database, "usuarios");
      const q = query(usuariosRef, where("ida", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No se encontró el usuario con ese ID.");
        Alert.alert(
          "Error",
          "No se encontró información del usuario. Contacta al administrador."
        );
        return;
      }

      querySnapshot.forEach((doc) => {
        const userData = doc.data();

        const userRole = userData.rol;

        if (userRole === "Encargado") {
          props.navigation.navigate("TabGroupAdmin");
        } else if (userRole === "Empleado") {
          props.navigation.navigate("TabGroupEmpleado");
        } else {
          Alert.alert("Error", "Rol no reconocido. Contacta al administrador.");
        }
      });
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "El usuario o la contraseña son incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <ImageBackground
          style={styles.logo}
          source={require("../src/Assets/caroficial.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.textInicio}>¡Bienvenido!</Text>
        <View style={styles.InputTexts}>
          <View style={styles.inputContainer}>
            <Icon name="mail" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              value={password}
            />
          </View>
          <TouchableOpacity
            style={styles.btnSignIn}
            onPress={logueo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D4E6F1",
  },
  encabezado: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    backgroundColor: "#D4E6F1",
  },
  logo: {
    width: 200,
    height: 150,
  },
  body: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    paddingTop: 20,
  },
  textInicio: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#064557",
    marginBottom: 20,
  },
  InputTexts: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 10,
    width: "85%",
    height: 50,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  btnSignIn: {
    marginTop: 20,
    height: 50,
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#144E78",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default Login;
