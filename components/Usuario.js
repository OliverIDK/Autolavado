import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { database } from '../src/config/fb'
import { deleteDoc, doc } from 'firebase/firestore'
import { AntDesign } from '@expo/vector-icons'
import Icon from '@expo/vector-icons/Entypo';
const Usuario = ({ id, name, rol, email,

}) => {
  return (
      <View style={styles.celdas}>

        <View style={styles.leftContainer}>
          <Icon name="user" size={25} color="#888" style={styles.icon} />
          <View style={styles.textContain}>
            <Text style={styles.txtName}>{name}</Text>
            <Text style={styles.txtRol}>{rol}</Text>
          </View>
        </View>

        <View>
          <TouchableOpacity>
            <Icon name="dots-three-horizontal" size={25} color="#888" style={styles.icon} />
          </TouchableOpacity>
        </View>

      </View>
  )
}

export default Usuario

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  celdas: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  },
  textContain: {
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
    padding: 10,
  },
  txtName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  txtRol:{
    fontSize: 12,
  }
})