import { configureStore } from "@reduxjs/toolkit";
import bookReducer from './reducers'
//bookReducer là tên tự đặt
export default configureStore(
   {
       reducer: {
           listBookInStore: bookReducer
           // listBookInStore: là tên tự đặt
       }
   }
);
