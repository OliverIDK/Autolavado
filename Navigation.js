import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Usuarios from "./screens/Usuarios";
import Servicios from "./screens/Servicios";
import Inventario from "./screens/Inventario";
import Reporte from "./screens/Reporte";
import Icon from "@expo/vector-icons/Entypo";
import AgregarUsuario from "./screens/AgregarUsuario";
import AgregarProducto from "./screens/AgregarProducto";
import EditarUsuario from "./screens/EditarUsuario";
import EditarProducto from "./screens/EditarProducto";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TipoVehiculo from "./screens/TipoVehiculo";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MaterialTaps = createMaterialTopTabNavigator();
function Taps(){
  return(
    <MaterialTaps.Navigator 
    screenOptions={{
      tabBarStyle: {
        elevation: 0, 
        shadowOpacity: 0,
        borderBottomWidth: 0,
        
      },
      headerStyle: {
        shadowOpacity: 0,
        elevation: 0,
      },
      headerShown: false,
    }}>
      <MaterialTaps.Screen name="Servicios" component={Servicios}/>
      <MaterialTaps.Screen name="Tipo" component={TipoVehiculo} options={{title:"Vehiculos"}}/>
    </MaterialTaps.Navigator>
  )
}
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TabGroupAdmin"
        component={TabGroupAdmin}
        options={{
          headerShown: false,
        }}
      />
            <Stack.Screen
        name="TabGroupEmpleado"
        component={TabGroupEmpleado}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddUsuario"
        component={AgregarUsuario}
        options={{
          title: "Agregar Usuario",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="AddProducto"
        component={AgregarProducto}
        options={{
          title: "Agregar Producto",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="EditUsuario"
        component={EditarUsuario}
        options={{
          title: "Agregar Producto",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="EditProducto"
        component={EditarProducto}
        options={{
          title: "Agregar Producto",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}

function TabGroupAdmin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        animation: "shift",
        headerShadowVisible: false,
        tabBarActiveTintColor: "#144E78",
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          if (route.name == "Home") {
            iconName = "home";
          } else if (route.name == "Usuarios") {
            iconName = "users";
          } else if (route.name == "Tabs") {
            iconName = "inbox";
          } else if (route.name == "Inventario") {
            iconName = "clipboard";
          } else if (route.name == "Reporte") {
            iconName = "bar-graph";
          }
          return <Icon name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Usuarios" component={Usuarios} />
      <Tab.Screen name="Tabs" component={Taps} options={{title:""}} />
      <Tab.Screen name="Inventario" component={Inventario} />
      <Tab.Screen name="Reporte" component={Reporte} />
    </Tab.Navigator>
  );
}
function TabGroupEmpleado() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        animation: "shift",
        headerShadowVisible: false,
        tabBarActiveTintColor: "#144E78",
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          if (route.name == "Home") {
            iconName = "home";
          } else if (route.name == "Inventario") {
            iconName = "clipboard";
          }
          return <Icon name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Inventario" component={Inventario} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
