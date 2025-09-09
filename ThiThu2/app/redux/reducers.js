import { createSlice } from "@reduxjs/toolkit";
import { deleteBookOnAPI, addBookOnAPI, updateBookOnAPI } from "./action";
const initialState = {
   listBook :[]
}
// thiết lập slice
const bookSlice = createSlice(
   {
       name: 'book',
       initialState,
       reducers:{
           //phần 1: reducer làm việc cục bộ
           addBook (state, action ){
               state.listBook.push ( action.payload )
           },           
       },
       extraReducers: builder =>{
            builder.addCase(deleteBookOnAPI.fulfilled, (state, action) => {
                state.listBook = state.listBook.filter(item => item.id !== action.payload);
            }).addCase(deleteBookOnAPI.rejected, (state,action) => {
                console.log('loi xoa', action.error.message);
            });


            builder.addCase(addBookOnAPI.fulfilled, (state, action) => {
                state.listBook.push(action.payload);
            }).addCase(addBookOnAPI.rejected, (state, action) => {
                console.log('loi them', action.error.message);
            });

            builder.addCase(updateBookOnAPI.fulfilled, (state, action) => {
                const index = state.listBook.findIndex(book => book.id === action.payload.id);
                if (index !== -1) {
                    state.listBook[index] = action.payload;
                }
            }).addCase(updateBookOnAPI.rejected, (state, action) => {
                console.log('loi cap nhat', action.error.message);
            });
       }
   }
);


export const {addBook} = bookSlice.actions;
export default bookSlice.reducer;
