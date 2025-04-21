import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			fetchUser();
		} else {
			setLoading(false);
		}
	}, []);

	const fetchUser = async () => {
		try {
			const response = await axios.get('/api/auth/me');
			setUser(response.data);
		} catch (error) {
			console.error('Error fetching user:', error);
			localStorage.removeItem('token');
			delete axios.defaults.headers.common['Authorization'];
		} finally {
			setLoading(false);
		}
	};

	const login = async (email, password) => {
		try {
			const response = await axios.post('/api/auth/login', { email, password });
			const { token } = response.data;
			localStorage.setItem('token', token);
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			await fetchUser();
			return { success: true };
		} catch (error) {
			console.error('Login error:', error);
			return {
				success: false,
				message: error.response?.data?.message || 'Login gagal'
			};
		}
	};

	const register = async (name, email, password, classCode) => {
		try {
			console.log('Registering with data:', { name, email, password, classCode });
			const response = await axios.post('/api/auth/register', {
				name,
				email,
				password,
				classCode
			});
			console.log('Register response:', response.data);
			const { token } = response.data;
			localStorage.setItem('token', token);
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			await fetchUser();
			return { success: true };
		} catch (error) {
			console.error('Register error:', error);
			console.error('Error response:', error.response?.data);
			return {
				success: false,
				message: error.response?.data?.message || 'Registrasi gagal'
			};
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		delete axios.defaults.headers.common['Authorization'];
		setUser(null);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<AuthContext.Provider value={{ user, login, register, logout, fetchUser }}>
			{children}
		</AuthContext.Provider>
	);
}; 