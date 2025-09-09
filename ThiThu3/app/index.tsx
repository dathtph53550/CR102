import { Text, View } from "react-native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import CarScreen from "./screen/carScreen";

export default function Index() {
  return (
    <Provider store={store}>
      <CarScreen />
    </Provider>
  );
}
