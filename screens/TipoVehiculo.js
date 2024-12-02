import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'

import Vehiculos from '../components/Vehiculos'
import Icon from '@expo/vector-icons/Entypo';

import React, { useState } from 'react'

import { database, auth } from '../src/config/fb';

const TipoVehiculo = () => {

  // ARREGLAR UI DE VEHICULOS

  const [vehiculos, setVehiculos] = useState([
    { id: 1, name: 'Lavado Externo', image: require("../assets/iconosServicios/carwash.png") },
    { id: 2, name: 'Lavado Interno', image: require("../assets/iconosServicios/lavadoInterno.png") },
    { id: 3, name: 'Lavado Interno', image: require("../assets/iconosServicios/pulido.png") },
  ]);

  const agregarVehiculos = () => {
    const nuevoVehiculo = {
      id: vehiculos.length + 1,
      name: `Servicio ${vehiculos.length + 1}`,
      image: require("../assets/iconosServicios/lavadoInterno.png"),
    };
    setVehiculos([...vehiculos, nuevoVehiculo]);
  };

  return (
      <View style={styles.body}>

        <ScrollView style={styles.scrollContainer}>

            <View style={styles.row}>
              {vehiculos.map((vehiculo) => (
                <Vehiculos key={vehiculo.id} vehiculos={vehiculo} />
              ))}
            </View>

        </ScrollView>

        <TouchableOpacity style={styles.btnAdd} onPress={agregarVehiculos}>
            <Icon name="circle-with-plus" size={65} color="#144E78" />
        </TouchableOpacity>

      </View>

  )
}

export default TipoVehiculo

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  body: {
    width: '100%',
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  row: {
    flexDirection: 'column'
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
})