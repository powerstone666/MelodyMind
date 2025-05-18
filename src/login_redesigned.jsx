import React, { useContext, useState, useEffect } from 'react';
import useMediaQuery from './useMedia';
import { Context } from './context.js'; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginWithEmailAndPassword, signInWithGoogle, resetPassword } from './Firebase/auth';
import { FiMail, FiLock, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc'; 

function Login() {
    const { setUsers, Users } = useContext(Context);
    const isAboveMedium = useMediaQuery("(min-width: 768px)");
    const [user, setUser] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const returnUrl = location.state?.returnUrl || '/';

    // If user is already logged in, redirect to home page
    useEffect(() => {
        if (Users) {
            navigate(returnUrl);
        }
    }, [Users, navigate, returnUrl]);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const userData = await loginWithEmailAndPassword(user.email, user.password);
            setUsers(userData);
            toast.success("Login successful!");
            navigate(returnUrl);
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.code === "auth/invalid-credential" 
                ? "Invalid email or password" 
                : "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const userData = await signInWithGoogle();
            setUsers(userData);
            toast.success("Login successful!");
            navigate(returnUrl);
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error("Google sign-in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetEmail) {
            toast.error("Please enter your email address");
            return;
        }
        
        setResetLoading(true);
        try {
            await resetPassword(resetEmail);
            toast.success("Password reset email sent! Check your inbox.");
            setShowForgotPassword(false);
            setResetEmail("");
        } catch (error) {
            console.error("Password reset error:", error);
            let errorMessage = "Failed to send reset email. Please try again.";
            
            if (error.code === "auth/user-not-found") {
                errorMessage = "No account found with this email address.";
            }
            
            toast.error(errorMessage);
        } finally {
            setResetLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (showForgotPassword) {
                handleResetPassword();
            } else {
                handleLogin(e);
            }
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] py-8 pb-36 w-full items-center justify-center px-6">
            <div className="max-w-md w-full space-y-8 bg-gray-900 shadow-2xl border border-gray-800 rounded-xl p-6 sm:p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400 mb-6">Sign in to continue to MelodyMind</p>
                </div>
                
                {showForgotPassword ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    name="resetEmail"
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="bg-gray-800 border border-gray-700 focus:ring-melody-pink-500 focus:border-melody-pink-500 block w-full pl-10 pr-3 py-2.5 rounded-lg text-gray-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <button
                                onClick={handleResetPassword}
                                disabled={resetLoading}
                                className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-melody-pink-600 hover:bg-melody-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-melody-pink-500 transition-colors"
                            >
                                {resetLoading ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <FiArrowRight className="mr-2" />
                                )}
                                Send Reset Link
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <button 
                                onClick={() => setShowForgotPassword(false)}
                                className="text-melody-pink-500 hover:text-melody-pink-400 text-sm font-medium"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            name="email"
                                            type="email" 
                                            value={user.email}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            className="bg-gray-800 border border-gray-700 focus:ring-melody-pink-500 focus:border-melody-pink-500 block w-full pl-10 pr-3 py-2.5 rounded-lg text-gray-200"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-gray-300 text-sm font-medium">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-melody-pink-500 hover:text-melody-pink-400 text-xs font-medium"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            value={user.password}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            className="bg-gray-800 border border-gray-700 focus:ring-melody-pink-500 focus:border-melody-pink-500 block w-full pl-10 pr-3 py-2.5 rounded-lg text-gray-200"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-melody-pink-600 hover:bg-melody-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-melody-pink-500 transition-colors"
                                >
                                    {loading ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <FiArrowRight className="mr-2" />
                                    )}
                                    Sign In
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-700 rounded-lg shadow-sm text-base font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                >
                                    <FcGoogle className="mr-2" />
                                    Google
                                </button>
                            </div>
                        </div>
                        
                        <div className="text-center text-sm mt-6">
                            <p className="text-gray-400">
                                Don't have an account? 
                                <Link to="/signup" className="ml-1 font-medium text-melody-pink-500 hover:text-melody-pink-400">
                                    Sign up now
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;
