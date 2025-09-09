import { Book } from '../redux/slices/sachSlice';

const API_URL = 'http://localhost:3000';

export const fetchAllBooks = async (): Promise<Book[]> => {
  const response = await fetch(`${API_URL}/Sach`);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return response.json();
};

export const fetchBookById = async (id: number): Promise<Book> => {
  const response = await fetch(`${API_URL}/Sach/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch book');
  }
  return response.json();
};

export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const response = await fetch(`${API_URL}/Sach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Failed to create book');
  }
  return response.json();
};

export const updateBookById = async (book: Book): Promise<Book> => {
  const response = await fetch(`${API_URL}/Sach/${book.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Failed to update book');
  }
  return response.json();
};

export const deleteBookById = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/Sach/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
}; 