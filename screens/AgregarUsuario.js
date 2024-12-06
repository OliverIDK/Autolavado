import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { database, auth } from "../src/config/fb";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

const AgregarUsuario = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState(null);
  const [password, setPassword] = useState("");

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Encargado", value: "Encargado" },
    { label: "Empleado", value: "Empleado" },
  ]);

  const isValidEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleAddUser = async () => {
    if (!name || !email || !rol || !password) {
      Alert.alert("Error", "Todos los campos son requeridos");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      const userRef = collection(database, "usuarios");
      await addDoc(userRef, {
        name: name,
        email: email,
        rol: rol,
        ida: userId,
      });

      Alert.alert("Éxito", "Usuario creado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo agregar el usuario. Inténtalo de nuevo."
      );
      console.error("Error al agregar el usuario:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <DropDownPicker
        open={open}
        value={rol}
        items={items}
        setOpen={setOpen}
        setValue={setRol}
        setItems={setItems}
        placeholder="Selecciona un rol"
        containerStyle={{ marginBottom: 15, width: "100%" }}
        style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8 }}
        dropDownStyle={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8 }}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.btnAdd} onPress={handleAddUser}>
        <Text style={styles.btnText}>Crear</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AgregarUsuario;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  btnAdd: {
    width: "100%",
    height: 50,
    backgroundColor: "#144E78",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
