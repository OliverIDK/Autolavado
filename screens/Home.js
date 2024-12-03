import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Icon from '@expo/vector-icons/Entypo';
import Divider from "../components/Divider";
import { useNavigation } from '@react-navigation/native';

const Home = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}> 
      <Divider />
      <TouchableOpacity
        style={styles.btnAdd}
        onPress={() => navigation.navigate("RegistrarServicio")}
      >
        <Icon name="circle-with-plus" size={65} color="#144E78" />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container:{
    width: '100%',
    height: '100%',
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
});
