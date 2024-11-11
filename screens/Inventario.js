import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import Divider from '../components/Divider';
import { database } from '../src/config/fb';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Producto from '../components/Producto';
import React, { useEffect, useState } from 'react';
import Icon from '@expo/vector-icons/Entypo';

const Inventario = () => {
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const collectionRef = collection(database, 'inventario');
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, querySnapshot => {
      setProductos(
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          producto: doc.data().producto,
          cantidad: doc.data().cantidad,
          medida: doc.data().medida,
        }))
      );
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Divider />
      <ScrollView>
      {productos.map(product => (
        <Producto key={product.id} {...product} />
      ))}
      <View style={styles.space}></View> 
      </ScrollView>
           
      <TouchableOpacity style={styles.btnAdd}>
        <Icon name="circle-with-plus" size={65} color="#144E78" style={styles.icon} onPress={() => navigation.navigate("AddProducto")}/>
      </TouchableOpacity>
    </View>
  );
};

export default Inventario;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'flex-start',
    position: 'relative',
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
  space:{
    height:90,
  }
});
