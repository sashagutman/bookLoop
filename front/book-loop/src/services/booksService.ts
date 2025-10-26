import axios from "axios";
import type { CreateBookPayload } from "../interfaces/books/CreateBookPayload";
import type { Book } from "../interfaces/books/Book";
import { apiBooks } from "./api";
const API = import.meta.env.VITE_BOOKS_API_URL;

const authHeaders = () => ({
  headers: { "x-auth-token": localStorage.getItem("token") || "" },
});

// list (публичный)
export function getAllBooks() {
  return apiBooks.get<Book[]>("/");
}

// create book
export function createBook(payload: CreateBookPayload) {
  return apiBooks.post("/", payload);
}

// by id
export function getBookById(bookId: string) {
  return apiBooks.get(`/${bookId}`);
}

// get book by userID
export function getBooksByUserId() {
  return axios.get(`${API}/my-books`, {
    params: { owned: "true" },
    ...authHeaders(),
  });
}

// update book by ID
export function updateBookById(id: string, payload: CreateBookPayload) {
  return apiBooks.put(`/${id}`, payload);
}

// delete book
export function deleteBook(bookId: string) {
  return apiBooks.delete(`/${bookId}`);
}

// like/unlike
export function likeDislikeBook(bookId: string) {
  return apiBooks.patch(`/${bookId}/like`, {}); 
}

// want/unwant
export function toggleWant(bookId: string) {
  return apiBooks.patch(`/${bookId}/want`, {}); 
}

// admin get all books
export function getAllUsersBooks() {
  return apiBooks.get(`/all-books`);
}

// admin delete all books
export function deleteAllBooks() {
  return apiBooks.delete(`/admin/all`);
}
