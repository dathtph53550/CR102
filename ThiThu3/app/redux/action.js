import { createAsyncThunk } from "@reduxjs/toolkit";
import { addCar } from "./reducer";

const API = "https://680355330a99cb7408ebade8.mockapi.io/XeMay";

export const fetchCar = createAsyncThunk(
    'car/fetchCar',
    async (_, thunkAPI) => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addCarOnAPI =  createAsyncThunk(
    'car/addCarOnAPI',
    async (objCar, thunkAPI) =>{
        try {
            // gửi api yc thêm
            const res = await fetch (API , {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(objCar)
            });
            // xử lý kêt quả
            const data = await res.json();
 
 
            if(res.ok){
                return data;
            }else{
                //có lỗi thì data chính là thông tin lỗi
                return thunkAPI.rejectWithValue (data);
            }
 
 
        } catch (error) {
            return thunkAPI.rejectWithValue (error.message);
        }
    }
 );

export const deleteCar = createAsyncThunk(
    "car/deleteCar", 
    async (id, thunkAPI) => {
        try {
            const response = await fetch(`${API}/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateCar = createAsyncThunk(
    "car/updateCar", 
    async (objCar, thunkAPI) => {
        try {
            const response = await fetch(`${API}/${objCar.id}`, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objCar)
            });
            
            const data = await response.json();
            
            if(response.ok){
                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);