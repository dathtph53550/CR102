import { createAsyncThunk } from "@reduxjs/toolkit";
import { addList } from "./reducer";

const api_url = 'http://localhost:3000/XeMay'; 

export const fetchList = ()=>{
   return async dispatch =>{
       try {
           console.log('Fetching books from API...');
           const res = await fetch( api_url );
           const arrList = await res.json(); 
           console.log('Received books:', arrList);
           arrList.forEach(row => {
               dispatch( addList (row ) )
           });
           console.log('All books added to store');
       } catch (error) {
           console.error( 'Lỗi lấy danh sách: ', error );
       }
   }
}

export const deleteListOnAPI =  createAsyncThunk(
  'list/deleteListOnAPI',
  async (id, thunAPI) =>{
      try {
          const res = await fetch (`${api_url}/${id}` , {
              method: 'DELETE'
          });
          if(res.ok){
              return id;
          }else{
              const err = await res.json();
              return thunAPI.rejectWithValue (err);
          }
      } catch (error) {
          return thunAPI.rejectWithValue (error.message);
      }
  }
);

export const addListOnAPI =  createAsyncThunk(
  'list/addListOnAPI',
  async (objList, thunAPI) =>{
      try {
          const res = await fetch (api_url , {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(objList)
          });
          const data = await res.json();
          if(res.ok){
              return data;
          }else{
              return thunAPI.rejectWithValue (data);
          }
      } catch (error) {
          return thunAPI.rejectWithValue (error.message);
      }
  }
);

export const updateListOnAPI =  createAsyncThunk(
  'list/updateListOnAPI',
  async (objList, thunAPI) =>{
      try {
          const res = await fetch (`${api_url}/${objList.id}` , {
              method: 'PUT',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(objList)
          });
          const data = await res.json();
          if(res.ok){
              return data;
          }else{
              return thunAPI.rejectWithValue (data);
          }
      } catch (error) {
          return thunAPI.rejectWithValue (error.message);
      }
  }
);