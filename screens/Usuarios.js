import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { database } from '../src/config/fb';
import { collection, onSnapshot, query } from 'firebase/firestore';
import Usuario from '../components/Usuario';
import Icon from '@expo/vector-icons/Entypo';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const collectionRef = collection(database, 'usuarios');
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, querySnapshot => {
      setUsers(
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          rol: doc.data().rol
        }))
      );
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <Icon name="magnifying-glass" size={20} color="#888" style={styles.icon} />
          <TextInput style={styles.input} placeholder="Buscar usuario" />
        </View>
      </View>
      <View style={styles.body}>
        {users.map(user => <Usuario key={user.id} {...user} />)}
      </View>
      <TouchableOpacity style={styles.btnAdd}>
        <Icon name="circle-with-plus" size={70} color="#144E78" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Usuarios;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  header: {
    width: '100%',
    height: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: "row", // Los elementos dentro de este contenedor estarán en fila
    alignItems: "center", // Centra verticalmente el ícono y el input
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    margin: 15,
    width: 350,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  icon: {
    padding: 10,
  },
  body: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  btnAdd: {
    
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 100,
    position: 'absolute',
    right: 10,
    bottom: 10,

  },
  btnText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
});
