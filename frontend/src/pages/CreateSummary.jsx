import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateSummary = () => {
	const [title, setTitle] = useState('');
	const [course, setCourse] = useState('');
	const [meetingNumber, setMeetingNumber] = useState('');
	const [description, setDescription] = useState('');
	const [file, setFile] = useState(null);
	const [error, setError] = useState('');
	const { user } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		const formData = new FormData();
		formData.append('title', title);
		formData.append('course', course);
		formData.append('meetingNumber', meetingNumber);
		formData.append('description', description);
		if (file) {
			formData.append('file', file);
		}

		try {
			await axios.post('/summaries', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			navigate('/');
		} catch (error) {
			setError(error.response?.data?.message || 'Gagal membuat ringkasan');
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Buat Ringkasan Baru</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				)}

				<div>
					<label htmlFor="title" className="block text-sm font-medium text-gray-700">
						Judul
					</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="input mt-1"
						required
					/>
				</div>

				<div>
					<label htmlFor="course" className="block text-sm font-medium text-gray-700">
						Mata Kuliah
					</label>
					<input
						type="text"
						id="course"
						value={course}
						onChange={(e) => setCourse(e.target.value)}
						className="input mt-1"
						required
					/>
				</div>

				<div>
					<label htmlFor="meetingNumber" className="block text-sm font-medium text-gray-700">
						Pertemuan
					</label>
					<input
						type="number"
						id="meetingNumber"
						value={meetingNumber}
						onChange={(e) => setMeetingNumber(e.target.value)}
						className="input mt-1"
						required
					/>
				</div>

				<div>
					<label htmlFor="description" className="block text-sm font-medium text-gray-700">
						Deskripsi
					</label>
					<textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="input mt-1"
						rows="4"
						required
					/>
				</div>

				<div>
					<label htmlFor="file" className="block text-sm font-medium text-gray-700">
						File (PDF/DOCX/TXT)
					</label>
					<input
						type="file"
						id="file"
						onChange={(e) => setFile(e.target.files[0])}
						className="mt-1"
						accept=".pdf,.docx,.txt"
					/>
				</div>

				<div>
					<button type="submit" className="btn btn-primary w-full">
						Buat Ringkasan
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateSummary; 