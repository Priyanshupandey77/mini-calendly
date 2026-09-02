import type { User } from "../types/api.types";
import type {
  RegisterData,
  LoginData,
  AuthResponse,
} from "../types/auth.types";
import api from "./api";

export async function register(data: RegisterData) {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
}

export async function login(data: LoginData) {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
}

export async function getMe() {
  const response = await api.get<User>("/auth/me");
  return response.data;
}
