import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Book {
  id: number;
  ph56666_ten_sach_22042025: string;
  ph56666_tac_gia_22042025: string;
  ph56666_gia_sach_22042025: number;
  ph56666_the_loai_22042025: string;
  ph56666_nam_phat_hanh_22042025: number;
  ph56666_mo_ta_22042025: string;
  ph56666_anh_bia_22042025: string;
}

interface SachState {
  books: Book[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedBook: Book | null;
}

const initialState: SachState = {
  books: [],
  status: 'idle',
  error: null,
  selectedBook: null,
};

// Fetch books
export const fetchBooks = createAsyncThunk('sach/fetchBooks', async () => {
  const response = await fetch('http://localhost:3000/Sach');
  const data = await response.json();
  return data;
});

// Add a new book
export const addBook = createAsyncThunk('sach/addBook', async (book: Omit<Book, 'id'>) => {
  const response = await fetch('http://localhost:3000/Sach', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  const data = await response.json();
  return data;
});

// Update a book
export const updateBook = createAsyncThunk('sach/updateBook', async (book: Book) => {
  const response = await fetch(`http://localhost:3000/Sach/${book.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  const data = await response.json();
  return data;
});

// Delete a book
export const deleteBook = createAsyncThunk('sach/deleteBook', async (id: number) => {
  await fetch(`http://localhost:3000/Sach/${id}`, {
    method: 'DELETE',
  });
  return id;
});

const sachSlice = createSlice({
  name: 'sach',
  initialState,
  reducers: {
    setSelectedBook: (state, action: PayloadAction<Book | null>) => {
      state.selectedBook = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch books';
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex((book) => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book.id !== action.payload);
      });
  },
});

export const { setSelectedBook } = sachSlice.actions;
export default sachSlice.reducer; 