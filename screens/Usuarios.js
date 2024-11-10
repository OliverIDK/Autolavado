import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { database } from '../src/config/fb';
import { collection, onSnapshot, query } from 'firebase/firestore';
import Usuario from '../components/Usuario';

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
      {users.map(user => <Usuario key={user.id} {...user} />)}
    </View>
  );
};

export default Usuarios;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
