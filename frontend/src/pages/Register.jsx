import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		classCode: ''
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { register } = useAuth();
	const navigate = useNavigate();
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Nama tidak boleh kosong';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email tidak boleh kosong';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Format email tidak valid';
		}

		if (!formData.password) {
			newErrors.password = 'Password tidak boleh kosong';
		} else if (formData.password.length < 6) {
			newErrors.password = 'Password minimal 6 karakter';
		}

		if (!formData.classCode.trim()) {
			newErrors.classCode = 'Kode kelas tidak boleh kosong';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setErrors({});

		if (!validateForm()) {
			return;
		}

		setLoading(true);
		try {
			await register(formData.name, formData.email, formData.password, formData.classCode);
			navigate('/');
		} catch (error) {
			setError(error.response?.data?.message || 'Gagal mendaftar');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Daftar Akun Baru
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Atau{' '}
						<Link to="/login" className="font-medium text-green-600 hover:text-green-500">
							masuk ke akun yang sudah ada
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
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								className={`appearance-none relative block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'
									} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
								placeholder="Nama Lengkap"
								value={formData.name}
								onChange={handleChange}
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600">{errors.name}</p>
							)}
						</div>
						<div>
							<label htmlFor="email" className="sr-only">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								className={`appearance-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
									} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
								placeholder="Email"
								value={formData.email}
								onChange={handleChange}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email}</p>
							)}
						</div>
						<div>
							<label htmlFor="classCode" className="sr-only">Kode Kelas</label>
							<input
								id="classCode"
								name="classCode"
								type="text"
								required
								className={`appearance-none relative block w-full px-3 py-2 border ${errors.classCode ? 'border-red-500' : 'border-gray-300'
									} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
								placeholder="Kode Kelas"
								value={formData.classCode}
								onChange={handleChange}
							/>
							{errors.classCode && (
								<p className="mt-1 text-sm text-red-600">{errors.classCode}</p>
							)}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								className={`appearance-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
									} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
								placeholder="Password"
								value={formData.password}
								onChange={handleChange}
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">{errors.password}</p>
							)}
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
						>
							{loading ? <LoadingSpinner /> : 'Daftar'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register; 