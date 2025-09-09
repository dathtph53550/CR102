import { configureStore } from "@reduxjs/toolkit";
import listReducer from './reducer'

export default configureStore(
   {
       reducer: {
           listInStore: listReducer
       }
   }
);