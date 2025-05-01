import React, { useState } from 'react';

const Login = () => {
	const [formData, setFormData] = useState({
		username: '',
		password: ''
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Implementasi logika login di sini
		console.log('Login attempt:', formData);
	};

	return (
		<div className="min-h-screen bg-purple-600 flex items-center justify-center p-4">
			<div className="max-w-4xl w-full flex bg-white rounded-lg shadow-lg overflow-hidden">
				{/* Bagian kiri - Area Dekoratif */}
				<div className="hidden lg:block lg:w-1/2 bg-purple-700 p-8 text-white">
					<div className="h-full flex flex-col justify-between">
						<h2 className="text-3xl font-bold mb-4">Selamat Datang Kembali!</h2>
						<p className="text-purple-200">
							Silakan login ke akun Anda untuk mengakses fitur premium
						</p>
					</div>
				</div>

				{/* Bagian kanan - Form Login */}
				<div className="w-full lg:w-1/2 p-8">
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-purple-700 mb-1">Hello!</h1>
						<p className="text-gray-600">Selamat Pagi</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Username
							</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
								required
							/>
						</div>

						<div className="flex items-center justify-between">
							<a href="#" className="text-sm text-purple-600 hover:text-purple-800">
								Lupa password?
							</a>
						</div>

						<button
							type="submit"
							className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
						>
							Login
						</button>

						<p className="text-center text-sm text-gray-600">
							Belum punya akun?{' '}
							<a href="#" className="text-purple-600 hover:text-purple-800 font-medium">
								Buat Akun
							</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login; 