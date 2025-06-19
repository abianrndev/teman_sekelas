import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';
import { motion } from 'framer-motion';
import { FiDownload, FiBookOpen, FiUser, FiBookmark, FiShare2, FiClock } from 'react-icons/fi';
import { IoMdSchool } from 'react-icons/io';
import { BsCalendarWeek } from 'react-icons/bs';

const SummaryDetail = () => {
	const { id } = useParams();
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isBookmarked, setIsBookmarked] = useState(false);

	useEffect(() => {
		fetchSummary();
	}, [id]);

	const fetchSummary = async () => {
		try {
			const response = await axios.get(`/summaries/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			setSummary(response.data);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching summary:', error);
			setLoading(false);
		}
	};

	const toggleBookmark = () => {
		setIsBookmarked(!isBookmarked);
		// Tambahkan logika API untuk bookmark di sini
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
			</div>
		);
	}

	if (!summary) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">Ringkasan Tidak Ditemukan</h2>
					<p className="text-gray-600 mb-6">Ringkasan yang Anda cari tidak tersedia atau mungkin telah dihapus.</p>
					<a
						href="/"
						className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
					>
						Kembali ke Beranda
					</a>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen bg-gray-50 py-8"
		>
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Header Section */}
				<div className="mb-8">
					<div className="flex justify-between items-start mb-4">
						<div>
							<motion.h1
								initial={{ y: -20 }}
								animate={{ y: 0 }}
								className="text-4xl font-bold text-gray-900 mb-2"
							>
								{summary.title}
							</motion.h1>

							<div className="flex items-center space-x-4 text-gray-600 mb-6">
								<span className="flex items-center">
									<FiUser className="mr-1" /> {summary.author_name}
								</span>
								<span className="flex items-center">
									<IoMdSchool className="mr-1" /> {summary.course}
								</span>
								<span className="flex items-center">
									<BsCalendarWeek className="mr-1" /> Pertemuan {summary.meeting_number}
								</span>
							</div>
						</div>

						<div className="flex space-x-3">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={toggleBookmark}
								className={`p-2 rounded-full ${isBookmarked ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
							>
								<FiBookmark className={`text-lg ${isBookmarked ? 'fill-current' : ''}`} />
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="p-2 bg-gray-100 text-gray-600 rounded-full"
							>
								<FiShare2 className="text-lg" />
							</motion.button>
						</div>
					</div>

					<div className="flex flex-wrap gap-3 mb-6">
						<span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex items-center">
							<FiBookOpen className="mr-1" /> Ringkasan
						</span>
						<span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
							{summary.course}
						</span>
						<span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium flex items-center">
							<FiClock className="mr-1" /> Dibuat 2 hari lalu
						</span>
					</div>
				</div>

				{/* Content Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
						>
							<div className="p-8">
								<div className="prose max-w-none">
									<h3 className="text-xl font-semibold text-gray-800 mb-4">Deskripsi</h3>
									<p className="text-gray-700 leading-relaxed mb-6">
										{summary.description || 'Tidak ada deskripsi yang tersedia.'}
									</p>

									{summary.content && (
										<>
											<h3 className="text-xl font-semibold text-gray-800 mb-4">Isi Ringkasan</h3>
											<div className="text-gray-700 leading-relaxed">
												{summary.content}
											</div>
										</>
									)}
								</div>

								{summary.file_path && (
									<motion.div
										whileHover={{ scale: 1.02 }}
										className="mt-8 bg-purple-50 rounded-lg p-4 border border-purple-100"
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center">
												<div className="bg-purple-100 p-3 rounded-lg mr-4">
													<FiDownload className="text-purple-600 text-xl" />
												</div>
												<div>
													<h4 className="font-medium text-gray-800">File Lampiran</h4>
													<p className="text-sm text-gray-500">Klik untuk mengunduh</p>
												</div>
											</div>
											<a
												href={`http://localhost:5000/${summary.file_path.replace(/\\/g, '/')}`}
												target="_blank"
												rel="noopener noreferrer"
												className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
											>
												<FiDownload className="mr-2" /> Unduh
											</a>
										</div>
									</motion.div>
								)}
							</div>
						</motion.div>

						{/* Comment Section */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="mt-8"
						>
							<CommentSection summaryId={id} />
						</motion.div>
					</div>

					{/* Sidebar */}
					<div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6 mb-6"
						>
							<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
								<IoMdSchool className="text-purple-600 mr-2" /> Tentang Mata Kuliah
							</h3>
							<div className="space-y-4">
								<div>
									<p className="text-sm text-gray-500">Dosen Pengampu</p>
									<p className="font-medium">Prof. Dr. Ahmad S.T., M.T.</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Semester</p>
									<p className="font-medium">Semester 4</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">SKS</p>
									<p className="font-medium">3 SKS</p>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.35 }}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6"
						>
							<h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Lainnya</h3>
							<div className="space-y-4">
								{[1, 2, 3].map((item) => (
									<div key={item} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
										<a href="#" className="block hover:bg-gray-50 p-2 rounded-lg transition-colors">
											<h4 className="font-medium text-gray-800">Ringkasan Pertemuan {item}</h4>
											<p className="text-sm text-gray-500 mt-1">Oleh: Mahasiswa {item}</p>
											<div className="flex items-center mt-2 text-sm text-purple-600">
												<FiBookOpen className="mr-1" /> Lihat Ringkasan
											</div>
										</a>
									</div>
								))}
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default SummaryDetail;