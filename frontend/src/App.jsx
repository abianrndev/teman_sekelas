import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateSummary from './pages/CreateSummary';
import SummaryDetail from './pages/SummaryDetail';
import Profile from './pages/Profile';

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="min-h-screen bg-gray-100">
					<Navbar />
					<main className="container mx-auto px-4 py-8">
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route
								path="/"
								element={
									<PrivateRoute>
										<Home />
									</PrivateRoute>
								}
							/>
							<Route
								path="/profile"
								element={
									<PrivateRoute>
										<Profile />
									</PrivateRoute>
								}
							/>
							<Route
								path="/summaries/create"
								element={
									<PrivateRoute>
										<CreateSummary />
									</PrivateRoute>
								}
							/>
							<Route
								path="/summaries/:id"
								element={
									<PrivateRoute>
										<SummaryDetail />
									</PrivateRoute>
								}
							/>
							<Route path="*" element={<Navigate to="/" replace />} />
						</Routes>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App; 