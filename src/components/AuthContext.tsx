import { createContext, useState, useEffect, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { jwtDecode } from "jwt-decode";
import { set } from 'zod';

export interface AuthContextType {
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, role: string) => Promise<AxiosResponse<any, any>>;
    logout: () => void;
    role: string | null;
}

export interface JWT {
    email: string;
    exp: number;
    iat: number;
    role: 'admin' | 'user';
    sub: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: PropsWithChildren) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [role, setRole] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
            const jwt = jwtDecode(token) as JWT
            setRole(jwt.role);
        }
        setLoading(false);
    }, []);

    const login = (email: string, password: string) => {
        const baseURL = import.meta.env.VITE_BASE_URL;
        return axios.post(`${baseURL}/account/login`, { email, password })
            .then(response => {
                const { token } = response.data;
                localStorage.setItem('token', token);
                setToken(token);
                const jwt = jwtDecode(token) as JWT;
                setRole(jwt.role);
            })
            .catch(error => {
                console.error('Login failed', error);
                throw error;
            });
    };

    const register = (username: string, email: string, password: string, role: string) => {
        const baseURL = import.meta.env.VITE_BASE_URL;
        return axios.post(`${baseURL}/account/register`, { username, email, password, role }).then((response) => {
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            return response;
        }).catch((error) => {
            console.error('Register failed', error);
            throw error;
        })
    }


    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setRole(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ loading, token, login, logout, register, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
