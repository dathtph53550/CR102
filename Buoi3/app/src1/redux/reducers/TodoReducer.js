import { createSlice } from "@reduxjs/toolkit";
import { deleteTodoApi ,addTodoAPI} from "../../../src1/redux/actions/TodoAction";



// thiết lập slice
const todoSlice = createSlice({
   name:'todo',
   initialState: {
       listTodo: [] // chứa ds công việc
   },
   reducers:{
       // các công việc cục bộ viết ở đây
       addTodo(state, action){
           state.listTodo.push(action.payload);
       }
   },
   extraReducers: builder =>{
       // vị trí viết code các hàm mở rộng để xử lý trạng thái promise khi tương tác api
       // sau khi gọi API xóa ở action xong thì trong này sẽ nhận trạng thái promise
       // hành vi xóa
       builder.addCase(deleteTodoApi.fulfilled, (state, action)=>{
           // xóa thành công trên API. Hàm deleteTodoApi là một hàm trong action
           // xóa todo ở store
           state.listTodo = state.listTodo.filter( row => row.id != action.payload) ;
       })
       builder.addCase(deleteTodoApi.rejected, (state, action)=>{
           // trường hợp không xóa được do lỗi server, link sai, id không tồn tại...
           console.log("Lỗi xóa: ", action.error.message);
       })
       builder.addCase(addTodoAPI.fulfilled, (state, action)=>{
        state.listTodo.push(action.payload);
        })
            .addCase(addTodoAPI.rejected, (state, action) => {
        // Xử lý khi yêu cầu thêm todo bị từ chối hoặc xảy ra lỗi
        console.log('Add todo rejected:', action.error.message);
});

 
   }
})


export const {addTodo} = todoSlice.actions;
export default todoSlice.reducer;
