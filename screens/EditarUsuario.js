import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { database } from '../src/config/fb';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditarUsuario = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name, email, rol } = route.params;

  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newRol, setNewRol] = useState(rol);

  const handleUpdateUser = async () => {
    if (!newName || !newEmail || !newRol) {
      Alert.alert("Error", "Todos los campos son requeridos");
      return;
    }

    try {
      const userRef = doc(database, 'usuarios', id);
      await updateDoc(userRef, {
        name: newName,
        email: newEmail,
        rol: newRol,
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

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Rol"
        value={newRol}
        onChangeText={setNewRol}
      />

      <TouchableOpacity style={styles.btnAdd} onPress={handleUpdateUser}>
        <Text style={styles.btnText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditarUsuario;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  btnAdd: {
    width: '100%',
    height: 50,
    backgroundColor: '#144E78',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
