import axios from "axios";

const API: string = import.meta.env.VITE_BOOKS_API_URL;

const authHeaders = () => ({
  headers: { "x-auth-token": localStorage.getItem("token") || "" },
});

// GET /api/books/my-books?favorites=true | want=true | status=reading|finished|unread
export function getMyBooksByRouteStatus(status: "favorites" | "to-read" | "reading" | "finished") 
{
  if (status === "favorites") 
    return axios.get(`${API}/my-books`, { params: { favorites: "true" }, ...authHeaders() });
  if (status === "to-read")   
    return axios.get(`${API}/my-books`, { params: { want: "true" }, ...authHeaders() });

  return axios.get(`${API}/my-books`, { params: { status }, ...authHeaders() }); // reading | finished
}

// PATCH /api/books/:id/like
export function toggleFavorite(bookId: string) {
  return axios.patch(`${API}/${bookId}/like`, null, authHeaders());
}

// PATCH /api/books/:id/want
export function toggleWant(bookId: string) {
  return axios.patch(`${API}/${bookId}/want`, null, authHeaders());
}

// PATCH /api/books/:id/status  { status: "reading" | "finished" | "unread" | null }
export function setBookStatus(bookId: string, status: "reading" | "finished" | "unread") {
  return axios.patch(`${API}/${bookId}/status`, { status }, authHeaders());
}

export function clearBookStatus(bookId: string) {
  return axios.patch(`${API}/${bookId}/status`, { status: null }, authHeaders());
}
