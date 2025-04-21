import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
	const { user, fetchUser } = useAuth();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		classCode: ''
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name,
				email: user.email,
				classCode: user.class_code
			});
			setLoading(false);
		}
	}, [user]);

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
		setSuccess('');

		try {
			const response = await axios.put('/api/auth/profile', formData);
			setSuccess('Profil berhasil diperbarui');
			await fetchUser(); // Refresh data user
		} catch (error) {
			setError(error.response?.data?.message || 'Gagal memperbarui profil');
		}
	};

	if (loading) {
		return <div className="text-center">Memuat profil...</div>;
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			{success && (
				<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
					{success}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-medium text-gray-700">
						Nama Lengkap
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						disabled
						className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
					/>
					<p className="mt-1 text-sm text-gray-500">Email tidak dapat diubah</p>
				</div>

				<div>
					<label htmlFor="classCode" className="block text-sm font-medium text-gray-700">
						Kode Kelas
					</label>
					<input
						type="text"
						id="classCode"
						name="classCode"
						value={formData.classCode}
						onChange={handleChange}
						disabled
						className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
					/>
					<p className="mt-1 text-sm text-gray-500">Kode kelas tidak dapat diubah</p>
				</div>

				<div>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Simpan Perubahan
					</button>
				</div>
			</form>
		</div>
	);
};

export default Profile; 