import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
	const [summaries, setSummaries] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	useEffect(() => {
		fetchSummaries();
	}, []);

	const fetchSummaries = async () => {
		try {
			const response = await axios.get(`/api/summaries/class/${user.class_code}`);
			setSummaries(response.data);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching summaries:', error);
			setLoading(false);
		}
	};

	if (loading) {
		return <div className="text-center">Memuat ringkasan...</div>;
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Ringkasan Materi</h1>
				<Link to="/summaries/create" className="btn btn-primary">
					Buat Ringkasan
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{summaries.map((summary) => (
					<Link
						key={summary.id}
						to={`/summaries/${summary.id}`}
						className="card hover:shadow-lg transition-shadow"
					>
						<h2 className="text-xl font-semibold mb-2">{summary.title}</h2>
						<p className="text-gray-600 mb-2">Oleh: {summary.author_name}</p>
						<p className="text-gray-600 mb-2">Mata Kuliah: {summary.course}</p>
						<p className="text-gray-600">Pertemuan: {summary.meeting_number}</p>
					</Link>
				))}
			</div>

			{summaries.length === 0 && (
				<div className="text-center py-8">
					<p className="text-gray-600">Belum ada ringkasan yang dibagikan.</p>
				</div>
			)}
		</div>
	);
};

export default Home; 