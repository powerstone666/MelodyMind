import React, { useContext, useState } from 'react';
import useMediaQuery from './useMedia';
import { Context } from './context.js'; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { loginWithEmailAndPassword, signInWithGoogle, resetPassword } from './Firebase/auth';

function Login() {
    const { setUsers } = useContext(Context);
    const isAboveMedium = useMediaQuery("(min-width: 768px)");
    const [user, setUser] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

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
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error("Google sign-in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!resetEmail.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        setResetLoading(true);
        try {
            await resetPassword(resetEmail);
            toast.success("Password reset email sent. Check your inbox!");
            setShowForgotPassword(false);
        } catch (error) {
            console.error("Password reset error:", error);
            toast.error(error.code === "auth/user-not-found" 
                ? "No account found with this email address" 
                : "Failed to send reset email. Please try again.");
        } finally {
            setResetLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-deep-grey to-deep-blue px-4 py-12 overflow-y-auto">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <div className="w-full max-w-md bg-gradient-to-br from-deep-grey/40 to-deep-blue/40 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 mb-20 mt-6">
                {!showForgotPassword ? (
                    <>
                        <div className="text-center mb-6">
                            <h1 className="text-xl md:text-3xl font-bold text-white mb-2">Welcome Back</h1>
                            <p className="text-gray-300">Sign in to continue to MelodyMind</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-300 block">Email</label>
                                <input 
                                    id="email"
                                    type="email" 
                                    name="email" 
                                    value={user.email}
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-3 rounded-lg bg-deep-grey/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500 focus:border-transparent"
                                    placeholder="Enter your email" 
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-300 block">Password</label>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-sm text-melody-pink-400 hover:text-melody-pink-300 font-medium"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <input 
                                    id="password"
                                    type="password" 
                                    name="password" 
                                    value={user.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg bg-deep-grey/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500 focus:border-transparent" 
                                    placeholder="Enter your password" 
                                    required 
                                    minLength={6}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full py-3 px-4 rounded-lg bg-melody-pink-600 hover:bg-melody-pink-500 text-white font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-melody-pink-300 disabled:opacity-70 mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-deep-blue/40 text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg bg-deep-grey/80 hover:bg-deep-grey/60 text-white font-medium transition duration-200 border border-gray-600"
                                    disabled={loading}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Sign in with Google
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-melody-pink-400 hover:text-melody-pink-300 font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                        
                        <div className="mt-4 text-center">
                            <Link to="/" className="text-sm text-gray-400 hover:text-melody-pink-300">
                                Back to home
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Reset Your Password</h1>
                            <p className="text-gray-300">We'll send you a link to reset your password</p>
                        </div>

                        <form onSubmit={handlePasswordReset} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="resetEmail" className="text-sm font-medium text-gray-300 block">Email</label>
                                <input 
                                    id="resetEmail"
                                    type="email" 
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)} 
                                    className="w-full px-4 py-3 rounded-lg bg-deep-grey/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500 focus:border-transparent"
                                    placeholder="Enter your email" 
                                    required 
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowForgotPassword(false)}
                                    className="flex-1 py-3 px-4 rounded-lg bg-deep-grey/80 hover:bg-deep-grey/60 text-white font-medium transition duration-200 border border-gray-600"
                                    disabled={resetLoading}
                                >
                                    Back to Login
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 px-4 rounded-lg bg-melody-pink-600 hover:bg-melody-pink-500 text-white font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-melody-pink-300 disabled:opacity-70"
                                    disabled={resetLoading}
                                >
                                    {resetLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </div>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <Link to="/" className="text-sm text-gray-400 hover:text-melody-pink-300">
                                Back to home
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;