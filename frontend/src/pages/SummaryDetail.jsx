import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';

const SummaryDetail = () => {
	const { id } = useParams();
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchSummary();
	}, [id]);

	const fetchSummary = async () => {
		try {
			const response = await axios.get(`/api/summaries/${id}`);
			setSummary(response.data);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching summary:', error);
			setLoading(false);
		}
	};

	if (loading) {
		return <div className="text-center">Memuat ringkasan...</div>;
	}

	if (!summary) {
		return <div className="text-center">Ringkasan tidak ditemukan</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-white rounded-lg shadow-lg p-6">
				<h1 className="text-3xl font-bold mb-4">{summary.title}</h1>
				<div className="flex items-center space-x-4 text-gray-600 mb-4">
					<span>Oleh: {summary.author_name}</span>
					<span>•</span>
					<span>Mata Kuliah: {summary.course}</span>
					<span>•</span>
					<span>Pertemuan: {summary.meeting_number}</span>
				</div>
				<div className="prose max-w-none">
					<p className="text-gray-700">{summary.description}</p>
				</div>
				{summary.file_path && (
					<div className="mt-4">
						<a
							href={`/uploads/${summary.file_path}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 hover:underline"
						>
							Lihat File
						</a>
					</div>
				)}
			</div>

			{/* Tambahkan CommentSection */}
			<CommentSection summaryId={id} />
		</div>
	);
};

export default SummaryDetail; 