import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { database } from '../src/config/fb'
import { deleteDoc, doc } from 'firebase/firestore'
import { AntDesign } from '@expo/vector-icons'
const Usuario = ({id, name, rol,
}) => {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{rol}</Text>
    </View>
  )
}

export default Usuario

const styles = StyleSheet.create({})