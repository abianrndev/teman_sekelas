import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<nav className="bg-gradient-to-r from-green-600 to-green-800 shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<div className="flex-shrink-0 flex items-center">
							<Link to="/" className="text-white text-xl font-bold hover:text-green-200 transition duration-300">
								Teman Sekelas
							</Link>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						{user ? (
							<>
								<Link
									to="/profile"
									className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
								>
									{user.name}
								</Link>
								<Link
									to="/summaries/create"
									className="bg-white text-green-600 hover:bg-green-100 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
								>
									Buat Ringkasan
								</Link>
								<button
									onClick={handleLogout}
									className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
								>
									Keluar
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
								>
									Masuk
								</Link>
								<Link
									to="/register"
									className="bg-white text-green-600 hover:bg-green-100 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
								>
									Daftar
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar; 