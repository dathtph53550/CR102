import { createSlice } from "@reduxjs/toolkit";
import { deleteListOnAPI, addListOnAPI, updateListOnAPI } from "./action";
const initialState = {
   list :[]
}
const listSlice = createSlice(
   {
       name: 'list',
       initialState,
       reducers:{
           addList (state, action ){
               state.list.push ( action.payload )
           },
       },
       extraReducers: builder =>{
            builder.addCase(deleteListOnAPI.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item.id !== action.payload);
            }).addCase(deleteListOnAPI.rejected, (state,action) => {
                console.log('loi xoa', action.error.message);
            });

            builder.addCase(addListOnAPI.fulfilled, (state, action) => {
                state.list.push(action.payload);
            }).addCase(addListOnAPI.rejected, (state, action) => {
                console.log('loi them', action.error.message);
            });

            builder.addCase(updateListOnAPI.fulfilled, (state, action) => {
                const index = state.list.findIndex(list => list.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            }).addCase(updateListOnAPI.rejected, (state, action) => {
                console.log('loi cap nhat', action.error.message);
            });
       }
   }
);

export const {addList} = listSlice.actions;
export default listSlice.reducer;