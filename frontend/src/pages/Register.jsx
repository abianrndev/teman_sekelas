import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-4xl w-full flex bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
				{/* Bagian kiri - Area Dekoratif */}
				<div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white">
					<div className="h-full flex flex-col justify-between">
						<h2 className="text-3xl font-bold mb-4">Bergabung Bersama Kami!</h2>
						<p className="text-purple-100">
							Daftar sekarang dan nikmati semua fitur yang kami sediakan
						</p>
					</div>
				</div>

				{/* Bagian kanan - Form Register */}
				<div className="w-full lg:w-1/2 p-8">
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-purple-700 mb-1">Daftar Akun Baru</h1>
						<p className="text-gray-600">Silakan isi data diri Anda</p>
					</div>

					{error && (
						<div className="mb-4 bg-red-100/80 backdrop-blur-sm border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
							<span className="block sm:inline">{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Nama Lengkap
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'
									} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm`}
								required
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600">{errors.name}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
									} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm`}
								required
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Kode Kelas
							</label>
							<input
								type="text"
								name="classCode"
								value={formData.classCode}
								onChange={handleChange}
								className={`w-full px-4 py-2 border ${errors.classCode ? 'border-red-500' : 'border-gray-300'
									} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm`}
								required
							/>
							{errors.classCode && (
								<p className="mt-1 text-sm text-red-600">{errors.classCode}</p>
							)}
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
								className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
									} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm`}
								required
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">{errors.password}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] mt-6"
						>
							{loading ? <LoadingSpinner /> : 'Daftar Sekarang'}
						</button>

						<p className="text-center text-sm text-gray-600 mt-4">
							Sudah punya akun?{' '}
							<Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium">
								Masuk di sini
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register; 