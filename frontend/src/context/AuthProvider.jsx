import { useState } from "react";
import * as authService from "../services/authService";
import AuthContext from "./authContext";

function readSession() {
    return {
        accessToken: sessionStorage.getItem("accessToken"),
        username: sessionStorage.getItem("username"),
    };
}

function AuthProvider({ children }) {
    const [session, setSession] = useState(readSession);

    const saveSession = (response) => {
        const { accessToken, username } = response.data;
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("username", username);
        setSession({ accessToken, username });
    };

    const login = async (credentials) => {
        saveSession(await authService.login(credentials));
    };

    const register = async (credentials) => {
        return authService.register(credentials);
    };

    const logout = () => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("username");
        setSession({ accessToken: null, username: null });
    };

    const value = {
        accessToken: session.accessToken,
        username: session.username,
        isAuthenticated: Boolean(session.accessToken),
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
