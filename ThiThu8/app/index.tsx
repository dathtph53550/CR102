import { Text, View } from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";
import Screen from "./screen/StudentScreen";

export default function Index() {
  return (
    <Provider store={store}>
      <Screen />
    </Provider>
  );
}
