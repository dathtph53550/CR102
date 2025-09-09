import { Text, View } from "react-native";
import { Provider } from "react-redux";
import CarScreen from "./screen/CarScreen";
import {store} from "./redux/store"

export default function Index() {
  return (
    <Provider store={store}>
      <CarScreen />
    </Provider>
  );
}
