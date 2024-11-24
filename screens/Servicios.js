import { StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import Servicio from '../components/Servicio';
import Divider from '../components/Divider';
import Icon from '@expo/vector-icons/Entypo';

const Servicios = () => {
 
  const [servicios, setServicios] = useState([
    { id: 1, name: 'Lavado Externo', image: require("../assets/iconosServicios/carwash.png") },
    { id: 2, name: 'Lavado Interno', image: require("../assets/iconosServicios/lavadoInterno.png") },
    { id: 3, name: 'Lavado Interno', image: require("../assets/iconosServicios/pulido.png") },
  ]);


  const agregarServicio = () => {
    const nuevoServicio = {
      id: servicios.length + 1,
      name: `Servicio ${servicios.length + 1}`,
      image: require("../assets/iconosServicios/lavadoInterno.png"),
    };
    setServicios([...servicios, nuevoServicio]);
  };

  return (
    <View style={styles.scrollContainer}>
      <Divider />
      <ScrollView contentContainerStyle={styles.body}>
        
        <View style={styles.row}>
          {servicios.map((servicio) => (
            <Servicio key={servicio.id} servicio={servicio} />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.btnAdd} onPress={(agregarServicio)}>
          <Icon name="circle-with-plus" size={65} color="#144E78" />
        </TouchableOpacity>
    </View>
  );
};

export default Servicios;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  body: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 20,
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
  addText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
});
