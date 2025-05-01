import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
		setFormData(prevState => ({
			...prevState,
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
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-4xl w-full flex bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
				{/* Bagian kiri - Area Dekoratif */}
				<div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white">
					<div className="h-full flex flex-col justify-between">
						<h2 className="text-3xl font-bold mb-4">Selamat Datang Kembali!</h2>
						<p className="text-purple-100">

						</p>
					</div>
				</div>

				{/* Bagian kanan - Form Login */}
				<div className="w-full lg:w-1/2 p-8">
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-purple-700 mb-1">Hello!</h1>
						<p className="text-gray-600">Selamat Datang</p>
					</div>

					{error && (
						<div className="mb-4 bg-red-100/80 backdrop-blur-sm border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
							<span className="block sm:inline">{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
								required
							/>
						</div>

						<div className="flex items-center justify-between">
							<Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
								Lupa password?
							</Link>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
						>
							{loading ? 'Memuat...' : 'Login'}
						</button>

						<p className="text-center text-sm text-gray-600">
							Belum punya akun?{' '}
							<Link to="/register" className="text-purple-600 hover:text-purple-800 font-medium">
								Buat Akun
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login; 