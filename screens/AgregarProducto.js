import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { database } from '../src/config/fb';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

const AgregarProducto = () => {
  const navigation = useNavigation();
  const [newProduct, setNewProduct] = useState({
    producto: '',
    cantidad: 0,
    medida: 'L',
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'L', value: 'L' },
    { label: 'ml', value: 'ml' },
    { label: 'Kg', value: 'Kg' },
    { label: 'g', value: 'g' },
  ]);

  const onSend = async () => {
    try {
      const productData = { ...newProduct, cantidad: Number(newProduct.cantidad), medida: value };
      await addDoc(collection(database, 'inventario'), productData);
      Alert.alert("Éxito", "Producto agregado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el producto. Inténtalo de nuevo.");
      console.error("Error al agregar producto:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Producto"
        onChangeText={(text) => setNewProduct({ ...newProduct, producto: text })}
        value={newProduct.producto}
      />
      <View style={styles.row}>
        <TextInput
          style={styles.quantityInput}
          placeholder="Cantidad"
          keyboardType="number-pad"
          onChangeText={(text) => setNewProduct({ ...newProduct, cantidad: text })}
          value={newProduct.cantidad.toString()}
        />
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Medida"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          onChangeValue={(value) => setNewProduct({ ...newProduct, medida: value })}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={onSend}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AgregarProducto;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#f8f8f8',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 8,
      marginBottom: 16,
      borderRadius: 4,
      fontSize: 16,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    quantityInput: {
      width: '35%',
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 8,
      borderRadius: 4,
      fontSize: 16,
      marginRight: 10,
    },
    dropdown: {
      width: 'auto',
      maxWidth: 180,
      borderColor: '#ddd',
    },
    dropdownContainer: {
      width: '45%',
      maxWidth: 180,
      borderColor: '#ddd',
    },
    button: {
      backgroundColor: '#144E78',
      padding: 12,
      borderRadius: 4,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
