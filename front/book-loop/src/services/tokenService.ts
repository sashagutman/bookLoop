import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../interfaces/users/Token";

const TOKEN_KEY = "token";

export function setToken(token: string) {
   localStorage.setItem(TOKEN_KEY, token);
 }
 export function getToken(): string | null {
   return localStorage.getItem(TOKEN_KEY);
 }
 export function removeToken() {
   localStorage.removeItem(TOKEN_KEY); }

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}

export function isTokenValid(token: string, skewSeconds = 60): boolean {
  const d = decodeToken(token);
  if (!d?.exp) return false; // теперь TS знает про exp
  const now = Math.floor(Date.now() / 1000);
  return d.exp > now - skewSeconds;
}
