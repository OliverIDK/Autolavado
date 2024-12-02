import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'

const Vehiculos = ({ vehiculos }) => {
  return (

      <TouchableOpacity style={styles.btnVehiculo}>
            <Image style={styles.iconVehiculo} source={require("../assets/iconosServicios/carwash.png")} />
            <Text style={styles.txtVehiculo}>{ vehiculos.name }</Text>
      </TouchableOpacity>
      
  )
}

export default Vehiculos

const styles = StyleSheet.create({
  btnVehiculo: {
        width: '45%',           
        height: 150,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        marginRight:7,
        marginLeft:12,
    },
    iconVehiculo: {
        width: 80,
        height: 80,
    },
    txtVehiculo: {
        marginTop: 10,
        textAlign: 'center',
    },
})