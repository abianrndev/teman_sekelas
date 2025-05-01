import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SummaryFilter = ({ onFilterChange }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [meetingRange, setMeetingRange] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [isShowingSuggestions, setIsShowingSuggestions] = useState(false);
	const [courses, setCourses] = useState([]);
	const suggestionsRef = useRef(null);

	// Meeting ranges
	const meetingRanges = [
		{ label: 'Semua Pertemuan', value: '' },
		{ label: 'Pertemuan 1-4', value: '1-4' },
		{ label: 'Pertemuan 5-8', value: '5-8' },
		{ label: 'Pertemuan 9-12', value: '9-12' },
		{ label: 'Pertemuan 13-16', value: '13-16' }
	];

	useEffect(() => {
		// Fetch existing courses from summaries
		const fetchCourses = async () => {
			try {
				const response = await axios.get('/api/summaries/courses');
				setCourses(response.data);
			} catch (error) {
				console.error('Error fetching courses:', error);
			}
		};
		fetchCourses();
	}, []);

	useEffect(() => {
		// Handle clicks outside suggestions
		const handleClickOutside = (event) => {
			if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
				setIsShowingSuggestions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		// Filter suggestions based on search term
		if (searchTerm) {
			const filtered = courses.filter(course =>
				course.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setSuggestions(filtered);
			setIsShowingSuggestions(true);
		} else {
			setSuggestions([]);
			setIsShowingSuggestions(false);
		}
	}, [searchTerm, courses]);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		onFilterChange({ course: e.target.value, meetingRange });
	};

	const handleMeetingRangeChange = (e) => {
		setMeetingRange(e.target.value);
		onFilterChange({ course: searchTerm, meetingRange: e.target.value });
	};

	const handleSuggestionClick = (suggestion) => {
		setSearchTerm(suggestion);
		setIsShowingSuggestions(false);
		onFilterChange({ course: suggestion, meetingRange });
	};

	return (
		<div className="mb-6 space-y-4">
			<div className="flex flex-col md:flex-row gap-4">
				{/* Search Bar with Auto-suggest */}
				<div className="relative flex-1">
					<input
						type="text"
						value={searchTerm}
						onChange={handleSearchChange}
						onFocus={() => setIsShowingSuggestions(true)}
						placeholder="Cari mata kuliah..."
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
					/>

					{/* Suggestions Dropdown */}
					{isShowingSuggestions && suggestions.length > 0 && (
						<div
							ref={suggestionsRef}
							className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
						>
							{suggestions.map((suggestion, index) => (
								<div
									key={index}
									className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
									onClick={() => handleSuggestionClick(suggestion)}
								>
									{suggestion}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Meeting Range Dropdown */}
				<select
					value={meetingRange}
					onChange={handleMeetingRangeChange}
					className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
				>
					{meetingRanges.map((range) => (
						<option key={range.value} value={range.value}>
							{range.label}
						</option>
					))}
				</select>

				{/* Clear Filters Button */}
				{(searchTerm || meetingRange) && (
					<button
						onClick={() => {
							setSearchTerm('');
							setMeetingRange('');
							onFilterChange({ course: '', meetingRange: '' });
						}}
						className="px-4 py-2 text-purple-600 hover:text-purple-800 font-medium focus:outline-none"
					>
						Reset Filter
					</button>
				)}
			</div>
		</div>
	);
};

export default SummaryFilter; 