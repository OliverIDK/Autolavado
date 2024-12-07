import {
  Alert,
  StyleSheet,
  Text,
  View,
  Animated,
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useRef } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "../src/config/fb";
import Icon from "@expo/vector-icons/Entypo";
import { TextInput } from "react-native-paper";

const auth = getAuth();

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;

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
      Alert.alert("Error", "El usuario o la contraseña son incorrectos");
    } finally {
      setLoading(false);
    }
  };

  // Animaciones
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9, // Reducir el tamaño
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1, // Restaurar el tamaño
      useNativeDriver: true,
    }).start();
    logueo(); // Ejecutar el inicio de sesión
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
        <TextInput
          style={styles.inputs}
          label="Email"
          placeholder="Ej. juanito123@gmail.com"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
          left={
            <TextInput.Icon
              icon={() => (
                <Icon
                  name="mail"
                  size={24}
                  color={isFocused ? "#1A69DC" : "#555"}
                />
              )}
            />
          }
        />
        <TextInput
          style={styles.inputs}
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={(password) => setPassword(password)}
          onFocus={() => setIsFocusedPassword(true)}
          onBlur={() => setIsFocusedPassword(false)}
          mode="outlined"
          secureTextEntry={!showPassword}
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
          left={
            <TextInput.Icon
              icon={() => (
                <Icon
                  name="lock"
                  size={24}
                  color={isFocusedPassword ? "#1A69DC" : "#555"}
                />
              )}
            />
          }
          right={
            password.length > 0 && (
              <TextInput.Icon
                icon={() => (
                  <Icon
                    name={showPassword ? "eye-with-line" : "eye"}
                    size={20}
                    color={isFocusedPassword ? "#1A69DC" : "#555"}
                  />
                )}
                onPress={() => setShowPassword(!showPassword)}
              />
            )
          }
        />
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={loading}
        >
          <Animated.View
            style={[styles.btnSignIn, { transform: [{ scale: scaleValue }] }]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Iniciar Sesión</Text>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
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
  inputs: {
    width: "85%",
    fontSize: 16,
    marginBottom: 20,
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
