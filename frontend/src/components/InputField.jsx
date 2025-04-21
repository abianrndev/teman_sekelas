import React from 'react';

const InputField = ({
	label,
	type = 'text',
	name,
	value,
	onChange,
	error,
	placeholder,
	required = false
}) => {
	return (
		<div className="mb-4">
			<label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<div className="relative">
				<input
					id={name}
					name={name}
					type={type}
					value={value}
					onChange={onChange}
					className={`appearance-none relative block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'
						} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition duration-150`}
					placeholder={placeholder}
					required={required}
				/>
				{error && (
					<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
						<svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
					</div>
				)}
			</div>
			{error && (
				<p className="mt-1 text-sm text-red-600">{error}</p>
			)}
		</div>
	);
};

export default InputField; 