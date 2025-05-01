import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const Home = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [summaries, setSummaries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const fetchSummaries = async () => {
			try {
				if (!user?.class_code) {
					setLoading(false);
					return;
				}

				const response = await axios.get(`http://localhost:5000/api/summaries/class/${user.class_code}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				});
				setSummaries(response.data);
			} catch (error) {
				console.error('Error fetching summaries:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchSummaries();
	}, [user]);

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	const filteredSummaries = summaries.filter(summary =>
		summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		summary.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
		summary.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Fixed Navbar */}
			{/* <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link to="/" className="text-xl font-bold text-purple-600">
							Teman Sekelas
						</Link>
						<div className="flex items-center space-x-4">
							{user ? (
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2">
										<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
											<span className="text-lg font-medium text-purple-600">
												{user.name.charAt(0).toUpperCase()}
											</span>
										</div>
										<span className="font-medium text-gray-700">{user.name}</span>
									</div>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={handleLogout}
										className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors duration-200"
									>
										Keluar
									</motion.button>
								</div>
							) : (
								<div className="flex items-center space-x-4">
									<Link
										to="/login"
										className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
									>
										Masuk
									</Link>
									<Link
										to="/register"
										className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors duration-200"
									>
										Daftar
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav> */}

			{/* Hero Section with padding-top to account for fixed navbar */}
			<div className="pt-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							Selamat Datang di Teman Sekelas
						</h1>
						<p className="text-xl text-purple-100 mb-8">
							Platform berbagi ringkasan materi kuliah untuk mahasiswa
						</p>
						{user && (
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<Link
									to="/summaries/create"
									className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition duration-300 shadow-lg"
								>
									Buat Ringkasan Baru
								</Link>
							</motion.div>
						)}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-2xl font-bold text-gray-900">Ringkasan Materi</h2>
					<div className="relative">
						<input
							type="text"
							placeholder="Cari ringkasan..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
						/>
						<svg
							className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredSummaries.map((summary) => (
						<motion.div
							key={summary.id}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
						>
							<div className="p-6">
								<div className="flex items-center justify-between mb-4">
									<span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
										{summary.course}
									</span>
									<span className="text-sm text-gray-500">
										Pertemuan {summary.meeting_number}
									</span>
								</div>
								<h2 className="text-xl font-semibold text-gray-900 mb-2">{summary.title}</h2>
								<p className="text-gray-600 mb-2">Oleh: {summary.author_name}</p>
								{summary.description && (
									<p className="text-gray-600 mb-4 line-clamp-2">{summary.description}</p>
								)}
								<div className="flex justify-end">
									<Link
										to={`/summaries/${summary.id}`}
										className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
									>
										Baca Selengkapnya
										<svg
											className="w-4 h-4 ml-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</Link>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{filteredSummaries.length === 0 && (
					<div className="text-center py-12 bg-white rounded-lg shadow-sm">
						<svg
							className="mx-auto h-12 w-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<p className="mt-4 text-gray-600">
							{summaries.length === 0
								? 'Belum ada ringkasan yang dibagikan.'
								: 'Tidak ada ringkasan yang sesuai dengan pencarian.'}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home; 