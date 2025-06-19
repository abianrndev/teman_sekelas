import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const Profile = () => {
	const { user, fetchUser } = useAuth();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		classCode: ''
	});
	const [avatarPreview, setAvatarPreview] = useState('');
	const [avatarFile, setAvatarFile] = useState(null);
	const [loading, setLoading] = useState({
		profile: false,
		avatar: false
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const fileInputRef = useRef(null);

	// Initialize form data and avatar
	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				email: user.email || '',
				classCode: user.classCode || ''
			});

			setAvatarPreview(
				user.avatar_url ||
				`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`
			);
		}
	}, [user]);

	// Handle avatar file selection
	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validation
		if (file.size > 2 * 1024 * 1024) {
			setError('Ukuran file maksimal 2MB');
			return;
		}
		if (!file.type.match('image.*')) {
			setError('Hanya file gambar (JPEG/PNG) yang diperbolehkan');
			return;
		}

		setAvatarFile(file);
		setError('');

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatarPreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	// Upload avatar to server
	const uploadAvatar = async () => {
		if (!avatarFile) return;

		setLoading({ ...loading, avatar: true });
		setError('');

		try {
			const formData = new FormData();
			formData.append('avatar', avatarFile);

			await axios.post('/users/upload-avatar', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});

			await fetchUser(); // Refresh user data
			setSuccess('Foto profil berhasil diubah!');
			setAvatarFile(null);
		} catch (err) {
			setError(err.response?.data?.message || 'Gagal mengupload foto profil');
		} finally {
			setLoading({ ...loading, avatar: false });
		}
	};

	// Handle profile form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!formData.name.trim()) {
			setError('Nama tidak boleh kosong');
			return;
		}

		try {
			setLoading({ ...loading, profile: true });
			await axios.put('/api/auth/profile', {
				name: formData.name
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			setSuccess('Profil berhasil diperbarui!');
			await fetchUser();
			setIsEditing(false);
		} catch (error) {
			setError(error.response?.data?.message || 'Gagal memperbarui profil');
		} finally {
			setLoading({ ...loading, profile: false });
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 pt-16 pb-10">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Avatar Section */}
				<div className="text-center mb-8">
					<div className="relative inline-block group">
						<img
							src={avatarPreview}
							alt="Profile"
							className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
						/>
						<motion.div
							whileHover={{ opacity: 1 }}
							className="absolute inset-0 bg-black/40 rounded-full opacity-0 flex items-center justify-center transition-opacity cursor-pointer"
							onClick={() => fileInputRef.current.click()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</motion.div>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleAvatarChange}
							accept="image/*"
							className="hidden"
						/>
					</div>

					{avatarFile && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mt-4"
						>
							<motion.button
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								onClick={uploadAvatar}
								disabled={loading.avatar}
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm"
							>
								{loading.avatar ? (
									<span className="flex items-center justify-center">
										<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Mengupload...
									</span>
								) : 'Simpan Foto'}
							</motion.button>
							<button
								onClick={() => {
									setAvatarFile(null);
									setAvatarPreview(user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`);
								}}
								className="ml-2 px-4 py-2 text-gray-700 hover:text-gray-900"
							>
								Batal
							</button>
						</motion.div>
					)}
				</div>

				{/* Profile Form */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white rounded-xl shadow-md overflow-hidden"
				>
					{error && (
						<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-red-700">{error}</p>
								</div>
							</div>
						</div>
					)}

					{success && (
						<div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-green-700">{success}</p>
								</div>
							</div>
						</div>
					)}

					{!isEditing ? (
						<div className="p-6 space-y-6">
							<div className="border-b border-gray-200 pb-5">
								<h3 className="text-lg font-medium leading-6 text-gray-900">Informasi Profil</h3>
							</div>

							<div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
								<div>
									<label className="block text-sm font-medium text-gray-500">Nama Lengkap</label>
									<p className="mt-1 text-sm text-gray-900">{user.name}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-500">Email</label>
									<p className="mt-1 text-sm text-gray-900">{user.email}</p>
								</div>
								{user.class_code && (
									<div>
										<label className="block text-sm font-medium text-gray-500">Kode Kelas</label>
										<p className="mt-1 text-sm text-gray-900">{user.class_code}</p>
									</div>
								)}
							</div>

							<div className="pt-2">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setIsEditing(true)}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
								>
									Edit Profil
								</motion.button>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="p-6 space-y-6">
							<div className="border-b border-gray-200 pb-5">
								<h3 className="text-lg font-medium leading-6 text-gray-900">Edit Profil</h3>
							</div>

							<div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
								<div className="sm:col-span-2">
									<label htmlFor="name" className="block text-sm font-medium text-gray-700">
										Nama Lengkap
									</label>
									<input
										type="text"
										name="name"
										id="name"
										value={formData.name}
										onChange={handleChange}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
									/>
								</div>

								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<input
										type="email"
										name="email"
										id="email"
										value={formData.email}
										disabled
										className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm p-2 border"
									/>
									<p className="mt-1 text-xs text-gray-500">Hubungi admin untuk perubahan email</p>
								</div>

								{user.class_code && (
									<div>
										<label htmlFor="classCode" className="block text-sm font-medium text-gray-700">
											Kode Kelas
										</label>
										<input
											type="text"
											name="classCode"
											id="classCode"
											value={formData.classCode}
											disabled
											className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm p-2 border"
										/>
										<p className="mt-1 text-xs text-gray-500">Kode kelas tidak dapat diubah</p>
									</div>
								)}
							</div>

							<div className="flex justify-end space-x-3 pt-2">
								<motion.button
									type="button"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => {
										setIsEditing(false);
										setError('');
										setSuccess('');
										setFormData({
											name: user.name,
											email: user.email,
											classCode: user.classCcode
										});
									}}
									className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
								>
									Batal
								</motion.button>

								<motion.button
									type="submit"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									disabled={loading.profile}
									className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
								>
									{loading.profile ? 'Menyimpan...' : 'Simpan Perubahan'}
								</motion.button>
							</div>
						</form>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default Profile;