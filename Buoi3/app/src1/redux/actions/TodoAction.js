import { createAsyncThunk } from "@reduxjs/toolkit";
import { addTodo } from "../../../src1/redux/reducers/TodoReducer";

const api_url = 'https://67ac54545853dfff53da3089.mockapi.io/thuc-hanh';


export const fetchTodos = () => {
    return async dispatch => {
        try {
            let res = await fetch(api_url);
            let data = await res.json();
            data.forEach(element => {
                dispatch(addTodo(element));
            });
        } catch (error) {
            console.error(error)
        }
    }
}

export const deleteTodoApi = createAsyncThunk(
    'todo/deleteTodoApi',
    async (id, thunkAPI)=>{
        try {
            // gọi api để xóa
            const res = await fetch(`${api_url}/${id}`,{
                method: 'DELETE'
            });
            if(res.ok){
                //xóa thành công, return lại cái id của todo đã xóa
                //để reducer sử dụng xóa trong store
                // action.payload của reducer sẽ là id
                return id;
            }else{
                // có lỗi thì thả lỗi về cho reducer
                const err = await res.json();
                return thunkAPI.rejectWithValue( err );
            }
 
 
        } catch (error) {
            return thunkAPI.rejectWithValue( error.message );
        }
    }
 )
 

 export const addTodoAPI = createAsyncThunk(
    'todo/addTodoAPI',
    async (objTodo, thunkAPI) => {
      console.log(objTodo);
      try {
        // Gửi yêu cầu  đến API để thêm
        const response = await fetch(api_url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(objTodo)
        });
        const data = await response.json();
        // console.log(response);
        if (response.ok) {
            // console.log(response);
           return data; 
        } else {
          // Nếu có lỗi từ phía server, trả về lỗi
          const errorData = await response.json();
          return thunkAPI.rejectWithValue(errorData);
        }
      } catch (error) {
        // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
