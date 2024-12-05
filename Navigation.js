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
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TipoVehiculo from "./screens/TipoVehiculo";
import RegistrarServicio from "./screens/RegistrarServicio";
import AgregarVehiculo from "./screens/AgregarVehiculo";
import AgregarServicio from "./screens/AgregarServicio";
import EditarServicio from "./screens/EditarServicio";
import EditarVehiculo from "./screens/EditarVehiculo";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MaterialTaps = createMaterialTopTabNavigator();
function Taps() {
  return (
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
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "normal",
        },
        tabBarActiveTintColor: "#144E78",
        tabBarInactiveTintColor: "#888",
        tabBarIndicatorStyle: {
          backgroundColor: "#144E78",
        },
      }}
    >
      <MaterialTaps.Screen
        name="Servicios"
        component={Servicios}
        options={{
          tabBarLabelStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <MaterialTaps.Screen
        name="Tipo"
        component={TipoVehiculo}
        options={{
          title: "Vehículos",
          tabBarLabelStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </MaterialTaps.Navigator>
  );
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
          title: "Volver",
        }}
      />
      <Stack.Screen
        name="RegistrarServicio"
        component={RegistrarServicio}
        options={{
          title: "Servicio",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="AddServicio"
        component={AgregarServicio}
        options={{
          title: "Servicio",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="TabGroupEmpleado"
        component={TabGroupEmpleado}
        options={{
          headerShown: false,
          title: "Volver",
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
        name="AgregarVehiculo"
        component={AgregarVehiculo}
        options={{
          title: "Agregar Vehiculo",
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
          title: "Editar Producto",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="EditServicio"
        component={EditarServicio}
        options={{
          title: "Editar Servicio",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
            <Stack.Screen
        name="EditVehiculo"
        component={EditarVehiculo}
        options={{
          title: "Editar Vehiculo",
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
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: "Actividad" }}
      />
      <Tab.Screen
        name="Usuarios"
        component={Usuarios}
        options={{ title: "Empleados" }}
      />
      <Tab.Screen
        name="Tabs"
        component={Taps}
        options={{ title: "Servicios & Vehiculos" }}
      />
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
