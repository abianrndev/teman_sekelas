import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationItem = ({ message, type = 'info', onClose }) => {
	const bgColors = {
		success: 'bg-green-500',
		error: 'bg-red-500',
		info: 'bg-purple-500',
		warning: 'bg-yellow-500'
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -50, scale: 0.3 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
			className={`${bgColors[type]} text-white p-4 rounded-lg shadow-lg flex items-center justify-between
                        transform transition-all duration-300 hover:scale-105`}
		>
			<span>{message}</span>
			<button
				onClick={onClose}
				className="ml-4 text-white hover:text-gray-200 focus:outline-none"
			>
				×
			</button>
		</motion.div>
	);
};

const Notification = ({ notifications, removeNotification }) => {
	return (
		<div className="fixed top-4 right-4 z-50 space-y-2 min-w-[300px]">
			<AnimatePresence>
				{notifications.map((notification) => (
					<NotificationItem
						key={notification.id}
						message={notification.message}
						type={notification.type}
						onClose={() => removeNotification(notification.id)}
					/>
				))}
			</AnimatePresence>
		</div>
	);
};

export default Notification; 