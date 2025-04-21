import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<nav className="bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg transition-colors duration-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<motion.div
							className="flex-shrink-0 flex items-center"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link to="/" className="text-white text-xl font-bold hover:text-purple-200 transition duration-300">
								Teman Sekelas
							</Link>
						</motion.div>
					</div>

					<div className="flex items-center space-x-4">
						{user ? (
							<>
								<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Link
										to="/profile"
										className="text-white hover:text-purple-200 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
									>
										{user.name}
									</Link>
								</motion.div>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleLogout}
									className="text-white hover:text-purple-200 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
								>
									Keluar
								</motion.button>
							</>
						) : (
							<>
								<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Link
										to="/login"
										className="text-white hover:text-purple-200 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
									>
										Masuk
									</Link>
								</motion.div>
								<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Link
										to="/register"
										className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
									>
										Daftar
									</Link>
								</motion.div>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar; 