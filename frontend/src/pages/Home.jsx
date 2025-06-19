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
                if (!user?.classCode) {
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`/summaries/class/${user.classCode}`, {
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
        await logout();
        navigate('/login');
    };

    const filteredSummaries = summaries.filter(summary =>
        summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
            {/* Hero Section */}
            <div className="pt-16 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                            Selamat Datang di Teman Sekelas
                        </h1>
                        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                            Platform berbagi ringkasan materi kuliah untuk mahasiswa dengan mudah dan cepat.
                        </p>
                        {user && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/summaries/create"
                                    className="inline-block bg-white text-purple-700 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition duration-300 shadow-xl transform-gpu"
                                >
                                    Buat Ringkasan Baru
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">Ringkasan Materi</h2>
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Cari ringkasan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                        />
                        <svg
                            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
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

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredSummaries.map((summary) => (
                        <motion.div
                            key={summary.id}
                            variants={{
                                hidden: { y: 20, opacity: 0 },
                                visible: { y: 0, opacity: 1 }
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform-gpu"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full text-xs font-medium">
                                        {summary.course}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Pertemuan {summary.meeting_number}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{summary.title}</h2>
                                <p className="text-sm text-gray-600 mb-2">Oleh: {summary.author_name}</p>
                                {summary.description && (
                                    <p className="text-gray-600 mb-4 line-clamp-2">{summary.description}</p>
                                )}
                                <div className="flex justify-end mt-4">
                                    <Link
                                        to={`/summaries/${summary.id}`}
                                        className="group text-purple-600 hover:text-purple-800 font-medium flex items-center transition-colors"
                                    >
                                        Baca Selengkapnya
                                        <svg
                                            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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
                </motion.div>

                {filteredSummaries.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center py-16 bg-white rounded-xl shadow-md"
                    >
                        <svg
                            className="mx-auto h-16 w-16 text-gray-300"
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
                        <p className="mt-4 text-gray-600 text-lg">
                            {summaries.length === 0
                                ? 'Belum ada ringkasan yang dibagikan.'
                                : 'Tidak ada ringkasan yang sesuai dengan pencarian.'}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;