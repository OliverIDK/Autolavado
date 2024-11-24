import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const Servicio = () => {
    return (
        
        <TouchableOpacity style={styles.btnService}>
            <Image style={styles.iconService} source={require("../assets/iconosServicios/carwash.png")} />
            <Text style={styles.txtService}>Lavado Externo</Text>
        </TouchableOpacity>
        
       
    );
};

export default Servicio;

const styles = StyleSheet.create({
    btnService: {
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
    iconService: {
        width: 80,
        height: 80,
    },
    txtService: {
        marginTop: 10,
        textAlign: 'center',
    },
});
