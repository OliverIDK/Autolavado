import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Alert } from 'react-native';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { database } from '../src/config/fb';

const EditarServicio = ({ route, navigation }) => {
  const { id } = route.params; // Obtener el ID del servicio desde las rutas
  const [nombre, setNombre] = useState('');
  const [precios, setPrecios] = useState({});
  const [tiposVehiculo, setTiposVehiculo] = useState([]);

  // Cargar los tipos de vehículos desde Firestore
  useEffect(() => {
    const fetchTiposVehiculo = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, 'tiposDeVehiculos'));
        const tipos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTiposVehiculo(tipos);
      } catch (error) {
        console.error('Error al obtener los tipos de vehículo:', error);
        Alert.alert('Error', 'No se pudieron cargar los tipos de vehículo.');
      }
    };

    const fetchServicio = async () => {
      try {
        const docRef = doc(database, 'servicios', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const servicio = docSnap.data();
          setNombre(servicio.nombre || '');
          setPrecios(servicio.precios || {});
        } else {
          Alert.alert('Error', 'El servicio no existe.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error al obtener el servicio:', error);
        Alert.alert('Error', 'No se pudo cargar el servicio.');
      }
    };

    fetchTiposVehiculo();
    fetchServicio();
  }, [id]);

  const handleGuardarCambios = async () => {
    // Validar nombre y precios
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre del servicio no puede estar vacío.');
      return;
    }

    const preciosValidos = Object.values(precios).every(
      (tipoVehiculo) => tipoVehiculo.precio && !isNaN(tipoVehiculo.precio)
    );
    if (!preciosValidos) {
      Alert.alert('Error', 'Todos los precios deben ser números válidos.');
      return;
    }

    try {
      // Actualizar el servicio en Firestore
      const docRef = doc(database, 'servicios', id);
      await updateDoc(docRef, {
        nombre,
        precios: Object.keys(precios).reduce((acc, tipoVehiculo) => {
          acc[tipoVehiculo] = { precio: precios[tipoVehiculo].precio }; // Mantener la estructura de "precio"
          return acc;
        }, {}),
      });

      Alert.alert('Éxito', 'Servicio actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar el servicio:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el servicio.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del servicio"
        value={nombre}
        onChangeText={setNombre}
      />
      {tiposVehiculo.map((tipo) => (
        <View key={tipo.id} style={styles.precioContainer}>
          <Text>{tipo.name}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Precio para ${tipo.name}`}
            keyboardType="numeric"
            value={precios[tipo.name]?.precio?.toString() || ''}  // Mostrar el precio correctamente
            onChangeText={(value) => {
              const precio = value ? parseFloat(value) : '';  // Convertir el valor a número
              setPrecios((prevPrecios) => ({
                ...prevPrecios,
                [tipo.name]: { precio },  // Guardar el precio como un objeto {precio}
              }));
            }}
          />
        </View>
      ))}
      <Button title="Guardar Cambios" onPress={handleGuardarCambios} color="#144E78" />
    </ScrollView>
  );
};

export default EditarServicio;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  precioContainer: {
    marginBottom: 15,
  },
});
