import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginImage from '../'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal masuk');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
            <div className="max-w-4xl w-full flex bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
                {/* Bagian kiri - Ilustrasi / Gambar */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-10 text-white flex-col justify-between">
                    <h2 className="text-3xl font-bold mb-6">Selamat Datang Kembali!</h2>

                    {/* Placeholder untuk gambar/ilustrasi */}
                    <div className="relative h-100 w-full flex items-center justify-center">
                        <img
                            src="/assets/mobile-login-amico.png" // Ganti dengan path ke gambar Anda
                            alt="Ilustrasi Login"
                            className="w-full h-full object-contain opacity-90"
                        />
                    </div>

                    <p className="mt-6 text-purple-100 text-lg">
                        Platform berbagi ringkasan kuliah.
                    </p>
                </div>

                {/* Bagian kanan - Form Login */}
                <div className="w-full lg:w-1/2 p-8 md:p-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-purple-700">Halo Lagi!</h1>
                        <p className="text-gray-600 mt-1">Silakan masuk untuk melanjutkan</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-sm" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-sm transition-shadow duration-200"
                                placeholder="masukkan email anda"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 backdrop-blur-sm transition-shadow duration-200"
                                placeholder="masukkan password anda"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                                Lupa password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                        >
                            {loading ? 'Memuat...' : 'Masuk'}
                        </button>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Belum punya akun?{' '}
                            <Link to="/register" className="text-purple-600 hover:text-purple-800 font-semibold">
                                Daftar Sekarang
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;