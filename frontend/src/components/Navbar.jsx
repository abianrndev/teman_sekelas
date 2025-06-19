// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [isScrolled, setIsScrolled] = useState(false);
	const [showProfileDropdown, setShowProfileDropdown] = useState(false); // State untuk dropdown

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const toggleProfileDropdown = () => {
		setShowProfileDropdown(!showProfileDropdown);
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<nav
			className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
					? 'bg-white/80 backdrop-blur-sm shadow-sm'
					: 'bg-transparent'
				}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo/Title */}
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<Link
							to="/"
							className={`text-xl font-bold ${isScrolled ? 'text-purple-600' : 'text-white'
								}`}
						>
							Teman Sekelas
						</Link>
					</motion.div>

					{/* Navigation Items */}
					<div className="flex items-center space-x-4 relative"> {/* Tambahkan relative untuk dropdown positioning */}
						{user ? (
							<>
								{/* Profile Section dengan Dropdown */}
								<div className="relative">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={toggleProfileDropdown}
										className="flex items-center space-x-2 cursor-pointer"
									>
										<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
											<span className="text-sm font-medium text-purple-600">
												{user.name.charAt(0).toUpperCase()}
											</span>
										</div>
										<span className={`font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
											{user.name}
										</span>
									</motion.div>

									{/* Dropdown Menu */}
									{showProfileDropdown && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
										>
											<Link
												to="/profile"
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
												onClick={() => setShowProfileDropdown(false)}
											>
												Edit Profil
											</Link>
											{/* <Link
												to="/settings"
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
												onClick={() => setShowProfileDropdown(false)}
											>
												Pengaturan
											</Link> */}
											<button
												onClick={handleLogout}
												className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
											>
												Keluar
											</button>
										</motion.div>
									)}
								</div>
							</>
						) : (
							<>
								{/* Tombol Masuk/Daftar untuk pengguna belum login */}
								<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Link
										to="/login"
										className={`px-4 py-2 font-medium ${isScrolled ? 'text-purple-600' : 'text-white'
											}`}
									>
										Masuk
									</Link>
								</motion.div>
								<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Link
										to="/register"
										className={`px-4 py-2 rounded-lg transition-colors ${isScrolled
												? 'bg-purple-600 text-white hover:bg-purple-700'
												: 'bg-white text-purple-600 hover:bg-purple-50'
											}`}
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