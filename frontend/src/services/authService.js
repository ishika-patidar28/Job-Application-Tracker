import api from "./api";

export const register = (credentials) => api.post("/auth/register", credentials);
export const login = (credentials) => api.post("/auth/login", credentials);
