import { Alert, StyleSheet, Text, View,TouchableOpacity, ImageBackground, TextInput} from "react-native";
import React, { useState } from "react";
import "react-native-gesture-handler";
import { database } from "../src/config/fb";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const auth = getAuth();
import Icon from '@expo/vector-icons/Entypo';

const Login = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const logueo = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Iniciando sesion", "Accediendo...");
      props.navigation.navigate("TapGroup");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "El usuario o la contraseña son incorrectos");
    }
  };
  
  return (
    <View style={styles.container}> 
      <View style={styles.encabezado}>
        <ImageBackground
          style={styles.logo}
          source={require("../src/Assets/caroficial.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.textInicio}>Bienvenido!</Text>
        <View style={styles.InputTexts}>
          <View style={styles.inputContainer}>
            <Icon name="mail" size={20} color="#888" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Email" onChangeText={(text)=>setEmail(text)} />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Password" onChangeText={(text)=>setPassword(text)} secureTextEntry={true}/>
          </View>
          <TouchableOpacity style={styles.btnSignIn} onPress={logueo}>
            <Text style={styles.btnText}>INICIAR SESIóN</Text>
          </TouchableOpacity>
          <Text style={styles.txtIDKPassword}>
            ¿Has olvidado tu contraseña?
          </Text>
        </View>
      </View>
    </View>
  
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "800px",
    backgroundColor: "#D4E6F1",
  },
  encabezado: {
    width: "100%",
    height: 250,
    backgroundColor: "#D4E6F1",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 150,
    paddingLeft: 50,
  },
  body: {
    height: "100%",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  textInicio: {
    marginTop: 50,
    fontSize: 35,
    fontWeight: "bold",
    color: "#064557",
  },
  InputTexts: {
    height: 325,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    margin: 15,
    width: 300,
    height: 50,
    gap: 5
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  icon: {
    padding: 10,
  },
  placeholderStyle: {
    fontSize: 22,
    color: "#ccc",
    backgroundColor: "green",
  },
  btnSignIn: {
    marginVertical: 20,
    height: 50,
    width: 280,
    marginHorizontal: 10,
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: "#144E78",
    alignItems: "center",
  },
  btnText: {
    textTransform: "uppercase",
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  txtIDKPassword: {
    color: "#144E78",
    fontWeight: "bold",
    fontSize: 12,
  },
});
