import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { database } from "../src/config/fb";
import { doc, updateDoc } from "firebase/firestore";

const EditarUsuario = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name, email, rol } = route.params;

  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [selectedButtonId, setSelectedButtonId] = useState(rol === "Encargado" ? 1 : 2);

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

  const handleUpdateUser = async () => {
    if (!newName || !selectedButtonId) {
      Alert.alert("Error", "Todos los campos son requeridos");
      return;
    }

    try {
      const userRef = doc(database, "usuarios", id);
      await updateDoc(userRef, {
        name: newName,
        rol: ButtonRoles.find((role) => role.id === selectedButtonId).label,
      });
      Alert.alert("Éxito", "Usuario actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el usuario. Inténtalo de nuevo.");
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuario</Text>

      <View style={styles.containRol}>
        {ButtonRoles.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.btnRol,
              {
                backgroundColor: selectedButtonId === button.id ? "#1A69DC" : "#E9E9E9",
              },
            ]}
            onPress={() => handlePress(button.id)}
          >
            <Image
              source={selectedButtonId === button.id ? button.imageSelected : button.imageDefault}
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
        value={newName}
        onChangeText={setNewName}
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

      {/* Este campo de correo ya no es editable */}
      <TextInput
        style={styles.inputs}
        label="Correo electrónico"
        placeholder="Ej. juanito123@gmail.com"
        keyboardType="email-address"
        value={newEmail}
        editable={false} // Ahora es solo lectura
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

      <TouchableOpacity
              style={[styles.btnAdd, { marginBottom: 20 }]}
              onPress={handleUpdateUser}>
              <Text
                style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
              >
                Actualizar
              </Text>
            </TouchableOpacity>
    </View>
  );
};

export default EditarUsuario;

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
    marginTop: 15,
    width: "100%",
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
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  containRol: {
    display: "flex",
    width: "100%",
    height: 125,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
    gap: 20,
  },
  btnRol: {
    width: 150,
    height: 115,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
  },
});
