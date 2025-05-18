import React, { useState, useContext, useEffect } from 'react';
import useMediaQuery from './useMedia';
import { Context } from './context.js'; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import { signupWithEmailAndPassword, signInWithGoogle } from './Firebase/auth';
import { FiMail, FiLock, FiUser, FiArrowRight} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc'; 

function Signup() {
    const { setUsers, Users } = useContext(Context);
    const [user, setUser] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const isAboveMedium = useMediaQuery("(min-width: 768px)");
    const navigate = useNavigate();

    // If user is already logged in, redirect to home page
    useEffect(() => {
        if (Users) {
            navigate('/');
        }
    }, [Users, navigate]);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        // Validate password match
        if (user.password !== user.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        
        // Validate password length
        if (user.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        
        setLoading(true);
        try {
            const userData = await signupWithEmailAndPassword(user.email, user.password, user.name);
            setUsers(userData);
            toast.success("Account created successfully!");
            navigate('/');
        } catch (error) {
            console.error("Signup error:", error);
            
            let errorMessage = "Signup failed. Please try again.";
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "This email is already in use. Try signing in instead.";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "Password is too weak. Use at least 6 characters.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const userData = await signInWithGoogle();
            setUsers(userData);
            toast.success("Account created successfully!");
            navigate('/');
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error("Google sign-in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] py-8 pb-36 w-full items-center justify-center px-6">
            <div className="max-w-md w-full space-y-8 bg-gray-900 shadow-2xl border border-gray-800 rounded-xl p-6 sm:p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400 mb-6">Join MelodyMind and start listening</p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    name="name"
                                    type="text" 
                                    value={user.name}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border border-gray-700 focus:ring-melody-pink-500 focus:border-melody-pink-500 block w-full pl-10 pr-3 py-2.5 rounded-lg text-gray-200"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>
                        
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
                                    className="bg-gray-800 border border-gray-700 focus:ring-melody-pink-500 focus:border-melody-pink-500 block w-full pl-10 pr-3 py-2.5 rounded-lg text-gray-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    value={user.password}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border border-gray-700 focus:ring-melody-pink-500 focus:border-melody-pink-500 block w-full pl-10 pr-3 py-2.5 rounded-lg text-gray-200"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                            <p className="text-gray-500 text-xs mt-1">Must be at least 6 characters</p>
                        </div>
                        
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    value={user.confirmPassword}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border border-gray-700 focus:ring-melody-pink-500 focus:border-melody-pink-500 block w-full pl-10 pr-3 py-2.5 rounded-lg text-gray-200"
                                    placeholder="Confirm your password"
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
                            Create Account
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
                        Already have an account? 
                        <Link to="/login" className="ml-1 font-medium text-melody-pink-500 hover:text-melody-pink-400">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
