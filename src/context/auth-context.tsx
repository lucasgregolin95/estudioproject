"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    studioId: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (data: { user: User; token: string }) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = (data: { user: User; token: string }) => {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/admin/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
