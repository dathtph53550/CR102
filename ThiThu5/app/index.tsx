import { Text, View } from "react-native";
import {Provider} from "react-redux";
import { store } from "./redux/store";
import SinhVienScreen from "./screen/SinhVienScreen";

export default function Index() {
  return (
    <Provider store={store}>
        <SinhVienScreen />
    </Provider>
  );
}
