import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';

const Servicio = ({ servicios }) => {
    return (
        
        <TouchableOpacity style={[styles.card, styles.cardSelected]}>
            <ImageBackground source={ servicios.image } resizeMode='contain' style={styles.image}></ImageBackground>
            <Text style={[styles.label, styles.labelSelected]}>{ servicios.name }</Text>
        </TouchableOpacity>

    );
};

export default Servicio;

const styles = StyleSheet.create({
    // container: {
    //     marginBottom: 20,
    //   },
    //   title: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     marginBottom: 10,
    //   },
    //   scroll: {
    //     flexDirection: 'row',
    //   },
      card: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
      },
      cardSelected: {
        backgroundColor: '#007BFF',
        borderColor: '#0056b3',
      },
      image: {
        width: 80,
        height: 80
      },
      label: {
        marginTop: 5,
        fontSize: 14,
        color: '#333',
      },
      labelSelected: {
        color: '#FFFFFF',
      },
});
