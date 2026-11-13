
import api from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  token: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signupUser = async (
  data: SignupData
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const loginUser = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("careerverse-token");
  localStorage.removeItem("careerverse-user");
  localStorage.removeItem("careerverse-name");
  localStorage.removeItem("careerverse-email");
};