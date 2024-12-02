import { StyleSheet, View, ScrollView, Text, TouchableOpacity , TextInput, Button} from 'react-native';

import Servicio from '../components/Servicio';
import Divider from '../components/Divider';
import Icon from '@expo/vector-icons/Entypo';
import Modal from "react-native-modal";
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';

import React, { useEffect, useState } from 'react';

import { database, auth } from '../src/config/fb';

const Servicios = () => {

  // BUSCAR...
  // IMPLEMENTAR -> IMAGE PICKER
  // AGREGAR Y MOSTRAR DATOS DE FIREBASE
  // AGREGAR MONTO Y VISTA DE EXITO

  // MODAL
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // DROPDOWN
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
      {label: 'Apple', value: 'apple'},
      {label: 'Banana', value: 'banana'},
      {label: 'Pear', value: 'pear'},
  ]);

  const [servicios, setServicios] = useState([
    { id: 1, name: 'Moto', image: require("../assets/iconosVehiculos/moto.png") },
    { id: 2, name: 'Sedan', image: require("../assets/iconosVehiculos/cocheGray.png") },
    { id: 3, name: 'Trocón', image: require("../assets/iconosVehiculos/camionGray.png") },
    { id: 4, name: 'BMW', image: require("../assets/iconosVehiculos/camionGray.png") },
    { id: 5, name: 'NISSAN', image: require("../assets/iconosVehiculos/camionGray.png") },
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

        <Text style={styles.subHeader}>Selecciona el tipo de vehículo</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
          {servicios.map((servicio) => (
            <Servicio key={servicio.id} servicios={servicio} />
          ))}
        </ScrollView>

        {/* Tipos de servicios */}
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Tipos de servicios</Text>
        </TouchableOpacity>

        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={'Choose a fruit.'}
          style={styles.dropdown}
        />

        <Button title="Show modal" onPress={toggleModal} />

        <Modal isVisible={isModalVisible}>
          <View style={{ flex: 1 }}>
            <Text>Hello!</Text>

            <Button title="Hide modal" onPress={toggleModal} />
          </View>
        </Modal>

        <View>
        <Modal isVisible={false}>
          <View style={{ flex: 1 }}>
            <Text>I am the modal content!</Text>
          </View>
        </Modal>
        </View>

        {/* Marca */}
        <TextInput style={styles.input} placeholder="Marca" placeholderTextColor="#999" />

        {/* Placas */}
        <TextInput style={styles.input} placeholder="Placas" placeholderTextColor="#999" />

        {/* Selecciona el color */}
        <Text style={styles.subtitle}>Selecciona el color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorContainer}>
          {['#FFFFFF', '#C0C0C0', '#000000', '#FF0000', '#0000FF', '#FFFF00', '#F5F5F5', '#008000'].map((color) => (
            <View key={color} style={[styles.colorCircle, { backgroundColor: color }]} />
          ))}
        </ScrollView>

      </ScrollView>

      <TouchableOpacity style={styles.btnAdd} onPress={agregarServicio}>
          <Icon name="circle-with-plus" size={65} color="#144E78" />
      </TouchableOpacity>

    </View>
  );
};

export default Servicios;

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
  scroll: {
    flexDirection: 'row',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#E8F0FE',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  colorContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
  },
  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
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
