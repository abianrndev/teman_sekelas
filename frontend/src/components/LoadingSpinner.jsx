import React from 'react';

const LoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center space-x-2">
			<div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
			<div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
			<div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
		</div>
	);
};

export default LoadingSpinner; 