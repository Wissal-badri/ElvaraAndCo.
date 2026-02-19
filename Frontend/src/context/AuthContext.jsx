import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Restore session from localStorage on page reload
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        if (token && role === 'admin') {
            setUser({ role, username });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, role, username: uname } = response.data;

            // Only allow admin users to log in via this form
            if (role !== 'admin') {
                return { success: false, message: 'Access denied. Admin accounts only.' };
            }

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('username', uname);
            setUser({ role, username: uname });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Invalid username or password.';
            return { success: false, message };
        }
    };

    const logout = () => {
        navigate('/');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setUser(null);
    };

    const value = { user, login, logout, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
