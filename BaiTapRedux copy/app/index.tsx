import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store/index";
import ManHinhChiTiet from "./screens/ChiTieuScreen";

const Index = () => {
  return (
    <Provider store={store}>
      <ManHinhChiTiet />
    </Provider>
  );
};

export default Index;
