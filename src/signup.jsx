import React, { useState, useContext } from 'react';
import useMediaQuery from './useMedia';
import { Context } from './context.js'; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { signupWithEmailAndPassword, signInWithGoogle } from './Firebase/auth';

function Signup() {
    const { setUsers } = useContext(Context);
    const [user, setUser] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const isAboveMedium = useMediaQuery("(min-width: 768px)");

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
        
        setLoading(true);
        try {
            const userData = await signupWithEmailAndPassword(user.email, user.password, user.name);
            setUsers(userData);
            toast.success("Account created successfully!");
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
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error("Google sign-in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-deep-grey to-deep-blue px-4">
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

            <div className="w-full max-w-md bg-gradient-to-br from-deep-grey/40 to-deep-blue/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-300">Join MelodyMind and explore music</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-300 block">Full Name</label>
                        <input 
                            id="name"
                            type="text" 
                            name="name" 
                            value={user.name}
                            onChange={handleInputChange} 
                            className="w-full px-4 py-3 rounded-lg bg-deep-grey/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500 focus:border-transparent"
                            placeholder="Enter your name" 
                            required 
                        />
                    </div>

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
                        <label htmlFor="password" className="text-sm font-medium text-gray-300 block">Password</label>
                        <input 
                            id="password"
                            type="password" 
                            name="password" 
                            value={user.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg bg-deep-grey/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500 focus:border-transparent" 
                            placeholder="Create a password" 
                            required 
                            minLength={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 block">Confirm Password</label>
                        <input 
                            id="confirmPassword"
                            type="password" 
                            name="confirmPassword" 
                            value={user.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg bg-deep-grey/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500 focus:border-transparent" 
                            placeholder="Confirm your password" 
                            required 
                            minLength={6}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 px-4 rounded-lg bg-melody-pink-600 hover:bg-melody-pink-500 text-white font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-melody-pink-300 disabled:opacity-70"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                            </div>
                        ) : (
                            'Sign Up'
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
                            Sign up with Google
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-melody-pink-400 hover:text-melody-pink-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
