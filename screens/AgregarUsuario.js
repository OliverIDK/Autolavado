import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { database, auth } from "../src/config/fb";
import { collection, addDoc } from "firebase/firestore";

const AgregarUsuario = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedButtonId, setSelectedButtonId] = useState(null);

  const ButtonRoles = [
    {
      id: 1,
      imageDefault: require("../src/Assets/iconRoles/Encargado.png"),
      imageSelected: require("../src/Assets/iconRoles/EncargadoSelected.png"),
      label: "Encargado",
    },
    {
      id: 2,
      imageDefault: require("../src/Assets/iconRoles/empleado.png"),
      imageSelected: require("../src/Assets/iconRoles/empleadoSelected.png"),
      label: "Empleado",
    },
  ];

  const handlePress = (id) => {
    setSelectedButtonId(id);
  };

  const isValidEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleAddUser = async () => {
    if (!name || !email || !selectedButtonId || !password) {
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
        rol: ButtonRoles.find((role) => role.id === selectedButtonId).label,
        ida: userId,
      });

      Alert.alert("Éxito", "Usuario creado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el usuario. Inténtalo de nuevo.");
      console.error("Error al agregar el usuario:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Usuario</Text>
      <View style={styles.containRol}>
        {ButtonRoles.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.btnRol,
              {
                backgroundColor:
                  selectedButtonId === button.id ? "#1A69DC" : "#E9E9E9",
              },
            ]}
            onPress={() => handlePress(button.id)}
          >
            <Image
              source={
                selectedButtonId === button.id
                  ? button.imageSelected
                  : button.imageDefault
              }
              style={styles.image}
            />
            <Text
              style={[
                {
                  fontSize: 16,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: selectedButtonId === button.id ? "#FFFFFF" : "#000000",
                },
              ]}
            >
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.inputs}
        label="Nombre"
        placeholder="Ej. Juan"
        value={name}
        onChangeText={setName}
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
        style={styles.inputs}
        label="Correo electrónico"
        placeholder="Ej. juanito123@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
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
        style={styles.inputs}
        label="Contraseña"
        placeholder="Ej. @AcS4.Zy"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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
  inputs: {
    width: "100%",
    fontSize: 16,
    marginBottom: 15,
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
  containRol: {
    display: 'flex',
    width: '100%',
    height: 125,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    gap: 20,
},
btnRol: {
  width: 150,
  height: 115,
  backgroundColor: 'white',
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
},
image: {
  width: 70,
  height: 70,
},
});
