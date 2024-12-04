import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore'; 
import Servicio from '../components/Servicio';
import { database } from '../src/config/fb'; 
import Icon from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const Servicios = () => {
  const navigation = useNavigation();
  const [servicios, setServicios] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, 'servicios'),
      (querySnapshot) => {
        const serviciosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServicios(serviciosData);
        setLoading(false); 
      },
      (error) => {
        console.error("Error al obtener los servicios: ", error);
        setLoading(false);
        Alert.alert("Error", "Hubo un problema al cargar los servicios.");
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando servicios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {servicios.length > 0 ? (
          servicios.map((servicio) => (
            <Servicio
              key={servicio.id} 
              id={servicio.id} 
              nombre={servicio.nombre} 
            />
          ))
        ) : (
          <Text>No hay servicios disponibles en este momento.</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.btnAdd} onPress={() => navigation.navigate('AddServicio')}>
        <Icon name="circle-with-plus" size={65} color="#144E78" />
      </TouchableOpacity>
    </View>
  );
};

export default Servicios;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F8F8",
    width:"100%",
    height:"100%"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F8F8F8",
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
  btnAdd: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
