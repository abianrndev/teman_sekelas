import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await login(formData.email, formData.password);
			navigate('/');
		} catch (error) {
			setError(error.response?.data?.message || 'Gagal login');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Masuk ke Akun Anda
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Atau{' '}
						<Link to="/register" className="font-medium text-green-600 hover:text-green-500">
							daftar akun baru
						</Link>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
							<span className="block sm:inline">{error}</span>
						</div>
					)}
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email" className="sr-only">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
								placeholder="Email"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
								placeholder="Password"
								value={formData.password}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
						>
							{loading ? 'Memuat...' : 'Masuk'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login; 