import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const Home = () => {
	const { user } = useAuth();
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
				console.log('Data summaries:', response.data);
				setSummaries(response.data);
			} catch (error) {
				console.error('Error fetching summaries:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchSummaries();
	}, [user]);

	const filteredSummaries = summaries.filter(summary =>
		summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		summary.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
		summary.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<p className="text-gray-600">Memuat ringkasan...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Ringkasan Materi</h1>
					<div className="flex items-center space-x-4">
						<div className="relative">
							<input
								type="text"
								placeholder="Cari ringkasan..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
						{user && (
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<Link
									to="/summaries/create"
									className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition duration-300 shadow-md"
								>
									Buat Ringkasan Baru
								</Link>
							</motion.div>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredSummaries.map((summary) => {
						console.log('Rendering summary:', summary);
						return (
							<motion.div
								key={summary.id}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
							>
								<div className="p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-2">{summary.title}</h2>
									<p className="text-gray-600 mb-2">Oleh: {summary.author_name}</p>
									<p className="text-gray-600 mb-2">Mata Kuliah: {summary.course}</p>
									<p className="text-gray-600 mb-2">Pertemuan: {summary.meeting_number}</p>
									{summary.description && (
										<p className="text-gray-600 mb-4 line-clamp-2">{summary.description}</p>
									)}
									<div className="flex justify-end">
										<Link
											to={`/summaries/${summary.id}`}
											className="text-purple-600 hover:text-purple-700 font-medium"
										>
											Baca Selengkapnya
										</Link>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>

				{filteredSummaries.length === 0 && (
					<div className="text-center py-8 bg-purple-50 rounded-lg">
						<p className="text-gray-600">
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