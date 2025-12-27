import type { User } from "../interfaces/users/User";
import type { UserLogin } from "../interfaces/users/UserLogin";
import { setToken, removeToken } from "./tokenService";
import { apiUsers } from "./api";

// self
export async function getMe() {
  const { data } = await apiUsers.get<User>("/me");
  return data;
}
export async function updateMe(updateUser: Partial<User>) {
  const { data } = await apiUsers.put<User>("/me", updateUser);
  return data;
}
export function deleteMe() {
  return apiUsers.delete("/me");
}
export function updateMyPassword(newPassword: string) {
  return apiUsers.patch("/me/password", { newPassword });
}

// admin-only
export function getUserById(id: string) {
  return apiUsers.get(`/${id}`);
}
export function deleteAllUsers(opts?: { keepAdmins?: boolean; keepSelf?: boolean }) {
  const params = new URLSearchParams();
  if (opts?.keepAdmins) params.set("keepAdmins", "true");
  if (opts?.keepSelf) params.set("keepSelf", "true");
  const qs = params.toString();
  const url = qs ? `/admin/all?${qs}` : `/admin/all`;
  return apiUsers.delete(url, { data: opts ?? {} });
}
export function getAllUsers() {
  return apiUsers.get<User[] | { users: User[] }>("/");
}
export function updateUserById(id: string, updateUser: Partial<User>) {
  return apiUsers.put<User>(`/${id}`, updateUser);
}
export function deleteUserById(id: string) {
  return apiUsers.delete(`/${id}`);
}

// auth
export function registerUser(normalizedUser: any) {
  return apiUsers.post("/register", normalizedUser);
}
export async function loginUser(credentials: UserLogin) {
  const { data } = await apiUsers.post<{ token: string }>("/login", credentials);
  setToken(data.token);
  return data;
}
export function logoutUser() {
  removeToken();
}
