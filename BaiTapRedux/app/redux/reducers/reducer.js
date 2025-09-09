import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const api_url = 'https://67e99851bdcaa2b7f5b9c65f.mockapi.io/api/api';

const removeAccents = (str) => {
  return str.normalize('NFD')
           .replace(/[\u0300-\u036f]/g, '')
           .replace(/đ/g, 'd')
           .replace(/Đ/g, 'D');
};

export const layDanhSachChiTieu = createAsyncThunk(
    'chiTieu/layDanhSachChiTieu',
    async (_, thunkAPI) => {
        try {
            let res = await fetch(api_url);
            let data = await res.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const themChiTieuAPI = createAsyncThunk(
    'chiTieu/themChiTieuAPI',
    async (chiTieu, thunkAPI) => {
        try {
            const response = await fetch(api_url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: chiTieu.title,
                    description: chiTieu.description,
                    date: chiTieu.date,
                    type: chiTieu.type,
                    amount: chiTieu.amount
                })
            });
            const data = await response.json();
            return response.ok ? data : thunkAPI.rejectWithValue(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const xoaChiTieuAPI = createAsyncThunk(
    'chiTieu/xoaChiTieuAPI',
    async (id, thunkAPI) => {
        try {
            const res = await fetch(`${api_url}/${id}`, { method: 'DELETE' });
            return res.ok ? id : thunkAPI.rejectWithValue(await res.json());
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const capNhatChiTieuAPI = createAsyncThunk(
    'chiTieu/capNhatChiTieuAPI',
    async (chiTieu, thunkAPI) => {
        try {
            const response = await fetch(`${api_url}/${chiTieu.id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: chiTieu.title,
                    description: chiTieu.description,
                    date: chiTieu.date,
                    type: chiTieu.type,
                    amount: chiTieu.amount
                })
            });
            const data = await response.json();
            return response.ok ? data : thunkAPI.rejectWithValue(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const chiTieuSlice = createSlice({
    name: 'chiTieu',
    initialState: { 
        danhSachChiTieu: [],
        searchTerm: '',
        loading: false,
        error: null,
        sortOrder: 'desc'
    },
    reducers: {
        searchExpense: (state, action) => {
            state.searchTerm = action.payload;
        },
        setSort: (state, action) => {
            state.sortOrder = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            // Lay danh sach
            .addCase(layDanhSachChiTieu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(layDanhSachChiTieu.fulfilled, (state, action) => {
                state.loading = false;
                state.danhSachChiTieu = action.payload;
            })
            .addCase(layDanhSachChiTieu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // add danh sach
            .addCase(themChiTieuAPI.fulfilled, (state, action) => {
                state.danhSachChiTieu.push(action.payload);
            })
            .addCase(themChiTieuAPI.rejected, (state, action) => {
                state.error = action.error.message;
            })
            // xoa danh sach
            .addCase(xoaChiTieuAPI.fulfilled, (state, action) => {
                state.danhSachChiTieu = state.danhSachChiTieu.filter(
                    chiTieu => chiTieu.id !== action.payload
                );
            })
            .addCase(xoaChiTieuAPI.rejected, (state, action) => {
                state.error = action.error.message;
            })
            // cap nhat danh sach
            .addCase(capNhatChiTieuAPI.fulfilled, (state, action) => {
                const index = state.danhSachChiTieu.findIndex(
                    chiTieu => chiTieu.id === action.payload.id
                );
                if (index !== -1) {
                    state.danhSachChiTieu[index] = action.payload;
                }
            })
            .addCase(capNhatChiTieuAPI.rejected, (state, action) => {
                state.error = action.error.message;
            });
    }
});

export const getFilteredExpenses = (state) => {
    const { danhSachChiTieu, searchTerm, sortOrder } = state.chiTieu;
    let filteredExpenses = [...danhSachChiTieu];
    
    if (searchTerm) {
        const searchTermNormalized = removeAccents(searchTerm.toLowerCase());
        filteredExpenses = filteredExpenses.filter(chiTieu => {
            const titleNormalized = removeAccents(chiTieu.title.toLowerCase());
            return titleNormalized.includes(searchTermNormalized);
        });
    }
    
    filteredExpenses.sort((a, b) => {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    });
    
    return filteredExpenses;
};

export const getTotalIncome = (state) => {
    return state.chiTieu.danhSachChiTieu
        .filter(chiTieu => chiTieu.type === 'thu')
        .reduce((total, chiTieu) => total + chiTieu.amount, 0);
};

export const getTotalExpense = (state) => {
    return state.chiTieu.danhSachChiTieu
        .filter(chiTieu => chiTieu.type === 'chi')
        .reduce((total, chiTieu) => total + chiTieu.amount, 0);
};

export const { searchExpense, setSort } = chiTieuSlice.actions;
export default chiTieuSlice.reducer;
