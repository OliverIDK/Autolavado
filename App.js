import "react-native-gesture-handler";
import Navigation from "./Navigation";
import { MenuProvider } from "react-native-popup-menu";
export default function App() {
  return (
    <MenuProvider>
      <Navigation />
    </MenuProvider>
  );
}
