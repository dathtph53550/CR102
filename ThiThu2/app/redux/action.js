import { createAsyncThunk } from "@reduxjs/toolkit";
import { addBook } from "./reducers";



const api_url = 'http://192.168.0.100:3000/books'; // Sửa định dạng URL


//định nghĩa hàm lấy dữ liệu, fetchBooks tên hàm tự đặt
export const fetchBooks = ()=>{
   return async dispatch =>{
       try {
           console.log('Fetching books from API...');
           const res = await fetch( api_url ); 
           const arrBook = await res.json(); // duyển dữ liệu về đối tượng
           console.log('Received books:', arrBook);
           //duyệt mảng để đổ dữ liệu vào store
           arrBook.forEach(row => {
               dispatch( addBook (row ) )
           });
           console.log('All books added to store');

       } catch (error) {
           console.error( 'Lỗi lấy danh sách: ', error );
       }
   }
}

export const deleteBookOnAPI =  createAsyncThunk(
    'book/deleteBookOnAPI',
    async (id, thunAPI) =>{
        try {
            // gửi api yc xóa
            const res = await fetch (`${api_url}/${id}` , {
                method: 'DELETE'
            });
            // xử lý kêt quả
            if(res.ok){
                return id;
            }else{
                //có lỗi
                const err = await res.json();
                return thunAPI.rejectWithValue (err);
            }
        } catch (error) {
            return thunAPI.rejectWithValue (error.message);
        }
    }

);

export const addBookOnAPI =  createAsyncThunk(
    'book/addBookOnAPI',
    async (objBook, thunAPI) =>{
        try {
            // gửi api yc thêm
            const res = await fetch (api_url , {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(objBook)
            });
            // xử lý kêt quả
            const data = await res.json();
 
 
            if(res.ok){
                return data;
            }else{
                //có lỗi thì data chính là thông tin lỗi
                return thunAPI.rejectWithValue (data);
            }
 
 
        } catch (error) {
            return thunAPI.rejectWithValue (error.message);
        }
    }
 );
 

export const updateBookOnAPI =  createAsyncThunk(
    'book/updateBookOnAPI',
    async (objBook, thunAPI) =>{
        try {
            // gửi api yêu cầu cập nhật
            const res = await fetch (`${api_url}/${objBook.id}` , {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objBook)
            });
            // xử lý kết quả
            const data = await res.json();

            if(res.ok){
                return data;
            }else{
                //có lỗi thì data chính là thông tin lỗi
                return thunAPI.rejectWithValue (data);
            }

        } catch (error) {
            return thunAPI.rejectWithValue (error.message);
        }
    }
);

