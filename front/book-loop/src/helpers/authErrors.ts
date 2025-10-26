import axios from "axios";

export function getLoginFriendlyMessage(err: unknown): string {
  if (axios.isAxiosError(err) && !err.response) {
    return "Network error. Please check your internet connection and try again.";
  }

  const status = axios.isAxiosError(err) ? err.response?.status : undefined;
  const serverMsg =
    (axios.isAxiosError(err) && (err.response?.data as any)?.message) || "";

  if (status === 403) {
    const m = serverMsg.match(/~\s*(\d+)\s*minute/i);
    const minutes = m?.[1];
    if (minutes) {
      return `Account is locked. Try again in ~${minutes} minutes.`;
    }
    return serverMsg || "Account is locked. Please try again later.";
  }

  if (status === 401) {
    return "Invalid email or password.";
  }

  if (status === 400) {
    return serverMsg || "Please check the form fields.";
  }

  if (status && status >= 500) {
    return "Server error. Please try again later.";
  }

  return serverMsg || "Login failed. Please try again.";
}
