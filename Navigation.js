import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Usuarios from "./screens/Usuarios";
import Servicios from "./screens/Servicios";
import Inventario from "./screens/Inventario";
import Reporte from "./screens/Reporte";
import Icon from '@expo/vector-icons/Entypo';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} 
        options={{
          headerShown: false
          
        }}/>
        <Stack.Screen name="TapGroup" component={TabGroup}
        options={{
          headerShown:false
        }} />
      </Stack.Navigator>
    );
  }

function TabGroup() {
  return (
    <Tab.Navigator
    screenOptions={({route})=>({
        tabBarShowLabel:false,
        tabBarIcon: ({color,focused,size}) =>{
            let iconName;
            if (route.name == "Home"){
                iconName = "home"
            }else if (route.name == "Usuarios"){
                iconName="users"
            }else if (route.name == "Servicios"){
                iconName="inbox"
            }else if (route.name == "Inventario"){
                iconName="clipboard"
            }else if (route.name == "Reporte"){
                iconName="bar-graph"
            }
            return <Icon name={iconName} color={color} size={size}/>
        }
    })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Usuarios" component={Usuarios} />
      <Tab.Screen name="Servicios" component={Servicios} />
      <Tab.Screen name="Inventario" component={Inventario} />
      <Tab.Screen name="Reporte" component={Reporte} />
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
