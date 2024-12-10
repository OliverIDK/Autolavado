import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../src/config/fb";
import { collection, onSnapshot, query } from "firebase/firestore";
import Usuario from "../components/Usuario";
import Icon from "@expo/vector-icons/Entypo";
import Divider from "../components/Divider";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-paper";

const Usuarios = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const collectionRef = collection(database, "usuarios");
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        rol: doc.data().rol,
      }));
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    });

    return unsubscribe;
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(text.toLowerCase()) ||
        user.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <View style={styles.container}>
      <Divider />
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            label="Buscar empleado"
            value={searchTerm}
            onChangeText={handleSearch}
            mode="outlined"
            activeOutlineColor="#1A69DC"
            outlineColor="#ccc"
            outlineStyle={{
              borderRadius: 12,
              borderWidth: 1.5,
            }}
            theme={{
              colors: {
                background: "#fff",
                placeholder: "#555",
                text: "#555",
              },
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            left={
              <TextInput.Icon
                icon={() => (
                  <Icon
                    name="magnifying-glass"
                    size={24}
                    color={isFocused ? "#1A69DC" : "#555"}
                  />
                )}
              />
            }
            placeholder="Ej. Juan"
          />
        </View>
      </View>
      <View style={styles.body}>
        <ScrollView>
          {filteredUsers.map((user) => (
            <Usuario
              key={user.id}
              id={user.id}
              name={user.name}
              email={user.email}
              rol={user.rol}
              onEdit={() =>
                navigation.navigate("EditUsuario", {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  rol: user.rol,
                })
              }
            />
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.btnAdd}
        onPress={() => navigation.navigate("AddUsuario")}
      >
        <Icon name="circle-with-plus" size={65} color="#144E78" />
      </TouchableOpacity>
    </View>
  );
};

export default Usuarios;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  header: {
    width: "100%",
    height: 100,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: 350,
    height: 60,
    margin: 15,
  },
  inputs: {
    fontSize: 15,
    height: 50,
  },
  body: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  btnAdd: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 90,
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  btnText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
});
