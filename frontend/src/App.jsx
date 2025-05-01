import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreateSummary from './pages/CreateSummary';
import SummaryDetail from './pages/SummaryDetail';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import PageTransition from './components/PageTransition';

function App() {
	const [notifications, setNotifications] = useState([]);

	const addNotification = (message, type = 'info') => {
		const id = Date.now();
		setNotifications(prev => [...prev, { id, message, type }]);
		setTimeout(() => {
			removeNotification(id);
		}, 5000);
	};

	const removeNotification = (id) => {
		setNotifications(prev => prev.filter(notification => notification.id !== id));
	};

	const isAuthPage = (pathname) => {
		return ['/login', '/register'].includes(pathname);
	};

	return (
		<Router>
			<AuthProvider>
				<div className={`min-h-screen transition-colors duration-200 ${isAuthPage(window.location.pathname) ? 'bg-gradient-to-br from-purple-50 to-purple-100' : 'bg-gray-50'}`}>
					{!isAuthPage(window.location.pathname) && <Navbar />}
					<AnimatePresence mode="wait">
						<PageTransition>
							<Routes>
								<Route path="/login" element={<Login onNotification={addNotification} />} />
								<Route path="/register" element={<Register onNotification={addNotification} />} />
								<Route path="/" element={<Home onNotification={addNotification} />} />
								<Route path="/profile" element={<Profile onNotification={addNotification} />} />
								<Route path="/summaries/create" element={<CreateSummary onNotification={addNotification} />} />
								<Route path="/summaries/:id" element={<SummaryDetail onNotification={addNotification} />} />
								<Route path="*" element={<Navigate to="/" />} />
							</Routes>
						</PageTransition>
					</AnimatePresence>
					<Notification notifications={notifications} onRemove={removeNotification} />
				</div>
			</AuthProvider>
		</Router>
	);
}

export default App; 