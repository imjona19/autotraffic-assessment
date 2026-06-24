import { apiClient } from "./apiClient";
import type { LoginCredentials, RegisterPayload, AuthResponse, User } from "../types/user";

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
        return data;
    },

    register: async (payload: RegisterPayload): Promise<{ message: string; user: User }> => {
        const { data } = await apiClient.post("/auth/register", payload);
        return data;
    },
};