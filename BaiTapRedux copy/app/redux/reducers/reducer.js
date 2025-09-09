import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const removeAccents = (str) => {
  return str.normalize('NFD')
           .replace(/[\u0300-\u036f]/g, '')
           .replace(/đ/g, 'd')
           .replace(/Đ/g, 'D');
};

// Thay thế các async thunk bằng các action thông thường
export const themChiTieuAPI = createAsyncThunk(
    'chiTieu/themChiTieuAPI',
    async (chiTieu) => {
        const newExpense = {
            id: Date.now().toString(),
            ...chiTieu
        };
        return newExpense;
    }
);

export const xoaChiTieuAPI = createAsyncThunk(
    'chiTieu/xoaChiTieuAPI',
    async (id) => {
        return id;
    }
);

export const capNhatChiTieuAPI = createAsyncThunk(
    'chiTieu/capNhatChiTieuAPI',
    async (chiTieu) => {
        return chiTieu;
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
            // Add expense
            .addCase(themChiTieuAPI.fulfilled, (state, action) => {
                state.danhSachChiTieu.push(action.payload);
            })
            // Delete expense
            .addCase(xoaChiTieuAPI.fulfilled, (state, action) => {
                state.danhSachChiTieu = state.danhSachChiTieu.filter(
                    chiTieu => chiTieu.id !== action.payload
                );
            })
            // Update expense
            .addCase(capNhatChiTieuAPI.fulfilled, (state, action) => {
                const index = state.danhSachChiTieu.findIndex(
                    chiTieu => chiTieu.id === action.payload.id
                );
                if (index !== -1) {
                    state.danhSachChiTieu[index] = action.payload;
                }
            });
    }
});

// Selectors
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
