import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return <div className="text-center">Memuat...</div>;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default PrivateRoute; 