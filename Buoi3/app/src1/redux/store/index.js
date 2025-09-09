import { configureStore } from "@reduxjs/toolkit";
import todoReducer from '../../../src1/redux/reducers/TodoReducer';
export default configureStore({
   reducer:{
       listTodoStore: todoReducer
   }
})
