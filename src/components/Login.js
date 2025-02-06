import React, { useState } from 'react';
import { BiLogoFacebookSquare } from 'react-icons/bi';
import { IoLogoGoogleplus } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full p-5 bg-white border border-gray-300 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form đăng nhập */}
                <div className="p-6 md:p-8">
                    <h2 className="my-8 text-3xl md:text-4xl font-bold text-center text-gray-800">Đăng nhập</h2>
                    {loginError && <p className="text-red-500 text-center mb-4">{loginError}</p>}
                    <form className="space-y-6">
                        <div className="flex flex-col items-center">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none focus:ring"
                                placeholder="Tài khoản"
                            />
                        </div>
                        <div className="flex flex-col items-center relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring"
                                placeholder="Mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="text-lg text-gray-500" />
                                ) : (
                                    <FaEye className="text-lg text-gray-500" />
                                )}
                            </button>
                        </div>

                        <div className="flex justify-between items-center px-4">
                            <span className="text-sm text-gray-500">Bạn chưa có tài khoản?</span>
                            <a href="/register" className="text-sm text-blue-500 hover:underline">
                                Đăng ký
                            </a>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className={`w-3/4 bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={loading}
                            >
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </div>

                        <div className="text-center text-gray-500 my-4">hoặc</div>

                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg w-10 h-10"
                            >
                                <IoLogoGoogleplus className="text-2xl" />
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-10 h-10"
                            >
                                <BiLogoFacebookSquare className="text-2xl" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="md:block p-8 rounded-lg transform  transition duration-300 relative">
                    <div className="relative z-10 mt-6 text-center">
                        <img
                            src="/assets/client/images/boCap.webp"
                            alt="Hình ảnh"
                            className="rounded-lg  mb-4 transform hover:scale-105 transition duration-500 w-96"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
