import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const CommentSection = ({ summaryId }) => {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const { user } = useAuth();

	useEffect(() => {
		fetchComments();
	}, [summaryId]);

	const fetchComments = async () => {
		try {
			const response = await axios.get(`/api/comments/summary/${summaryId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			setComments(response.data);
		} catch (error) {
			console.error('Error fetching comments:', error);
		} finally {
			setLoading(false); // PASTIKAN ADA INI!
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!newComment.trim() || submitting) return;

		setSubmitting(true);
		try {
			console.log('Submitting comment:', { content: newComment, summaryId });
			const response = await axios.post(`/api/comments/summary/${summaryId}`, {
				content: newComment
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});
			console.log('Comment response:', response.data);


			if (response.data && response.data.id) {
				const newCommentData = {
					id: response.data.id,
					content: response.data.content,
					author_name: response.data.author_name,
					created_at: response.data.created_at
				};

				console.log('Adding new comment to state:', newCommentData);
				setComments(prevComments => {
					const updatedComments = [newCommentData, ...prevComments];
					console.log('Updated comments:', updatedComments);
					return updatedComments;
				});
				setNewComment('');
			} else {
				console.error('Invalid comment response format:', response.data);
			
				await fetchComments();
			}
		} catch (error) {
			console.error('Error posting comment:', error);
			console.error('Error details:', error.response?.data);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return <div className="text-center">Memuat komentar...</div>;
	}

	return (
		<div className="mt-8">
			<h3 className="text-xl font-semibold mb-4">Komentar</h3>

			{/* Form Komentar */}
			<form onSubmit={handleSubmit} className="mb-6">
				<textarea
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					placeholder="Tulis komentar Anda..."
					className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows="3"
					disabled={submitting}
				/>
				<button
					type="submit"
					disabled={submitting}
					className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
						}`}
				>
					{submitting ? 'Mengirim...' : 'Kirim Komentar'}
				</button>
			</form>

			{/* Daftar Komentar */}
			<div className="space-y-4">
				{comments.map((comment) => (
					<div key={comment.id} className="bg-white p-4 rounded-lg shadow">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<span className="font-semibold">{comment.author_name}</span>
								<span className="text-gray-500 text-sm">
									{formatDistanceToNow(new Date(comment.created_at), {
										addSuffix: true,
										locale: id
									})}
								</span>
							</div>
						</div>
						<p className="mt-2 text-gray-700">{comment.content}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default CommentSection; 