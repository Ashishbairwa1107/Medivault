import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/axios';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('medivault_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing stored user', e);
                localStorage.removeItem('medivault_user');
            }
        }
        setLoading(false);
    }, []);

    // ✅ LOGIN
    const login = async (email, password, role) => {
        try {
            const { data } = await api.post('/auth/login', { 
                email, 
                password, 
                role: role.toLowerCase() 
            });
            setUser(data);
            localStorage.setItem('medivault_user', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            console.error('Login failed FULL:', error.response?.data || error.message);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    // ✅ REGISTER (FIXED)
    const register = async (name, email, password, role) => {
        try {
            const { data } = await api.post('/auth/register', {
                name,
                email,
                password,
                role
            });

            // DO NOT auto-login as per user required Login screen redirect.
            // setUser(data);
            // localStorage.setItem('medivault_user', JSON.stringify(data));

            return true;
        } catch (error) {
            console.error('Registration failed FULL:', error);
            return false;
        }
    };

    // ✅ GOOGLE LOGIN
    const googleLogin = async (token, role) => {
        try {
            const { data } = await api.post('/auth/google', { token, role });
            setUser(data);
            localStorage.setItem('medivault_user', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Google login failed FULL:', error);
            return false;
        }
    };

    // ✅ LOGOUT
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error('Logout error:', e);
        }
        setUser(null);
        localStorage.removeItem('medivault_user');
    };

    // Update user profile
    const updateUser = async (updates) => {
        try {
            const { data } = await api.put('/users/update-profile', updates);
            setUser(data);
            localStorage.setItem('medivault_user', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            console.error('Update user failed:', error);
            return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};