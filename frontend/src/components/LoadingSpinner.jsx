import React from 'react';

const LoadingSpinner = () => {
	return (
		<div className="relative w-12 h-12">
			<div className="absolute w-full h-full rounded-full border-4 border-purple-200"></div>
			<div className="absolute w-full h-full rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
		</div>
	);
};

export const LoadingOverlay = () => {
	return (
		<div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="text-center">
				<LoadingSpinner />
				<p className="text-purple-600 font-medium animate-pulse">
					Loading...
				</p>
			</div>
		</div>
	);
};

export const LoadingCard = () => {
	return (
		<div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
			<div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
			<div className="space-y-3">
				<div className="h-3 bg-gray-200 rounded"></div>
				<div className="h-3 bg-gray-200 rounded w-5/6"></div>
				<div className="h-3 bg-gray-200 rounded w-4/6"></div>
			</div>
		</div>
	);
};

export default LoadingSpinner; 