"use client"

import { AuthService } from '@/services/AuthService';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    claims: any;
    loading: boolean;
}

type AuthProviderProps = React.PropsWithChildren<{}>;

const AuthContext = createContext<AuthContextType>({ claims: null, loading: true });

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [claims, setClaims] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await AuthService.getCookie();
                setClaims(response);
            } catch (error) {
                setClaims(null);
            } finally {
                setLoading(false);
            }
        };
        fetchClaims();
    }, []);

    return <AuthContext.Provider value={{ claims, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);