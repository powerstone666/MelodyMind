import React, { useState, useContext } from 'react';
import useMediaQuery from './useMedia';
import { auth, googleProvider, appleProvider } from './Firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithRedirect, updateProfile } from 'firebase/auth';
import { Context } from './main';
import { set } from 'react-hook-form';
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Signup() {
    const { setUsers ,Users} = useContext(Context);
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const isAboveMedium = useMediaQuery("(min-width: 768px)");
    const [dloading, setDloading] = useState(true);
    const configUser = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const SignUp = async (e) => {
        e.preventDefault();
      

        try {
            setDloading(false);
            const res = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const User = res.user;

            // Update the user's profile with the display name
            await updateProfile(User, {
                displayName: user.name
            });

            // Update local storage and state
            localStorage.setItem("Users", JSON.stringify(User));
            setUsers(User);
            setDloading(true);
        } catch (error) {
            console.error("Error signing up:", error);
            toast.error(error);
            setDloading(true);
            // Handle error state or display an error message
        }
    }

    const signAuth = async (provider) => {
        try {
            let res;
            if (provider === "google") {
                await signInWithRedirect(auth, googleProvider);
                localStorage.setItem("Users", JSON.stringify(Users));
                setUsers(Users);
                // No immediate user available here, handle in redirect result
            } else if (provider === "apple") {
                await signInWithRedirect(auth, appleProvider);
                // No immediate user available here, handle in redirect result
            } else {
                // Handle other providers as needed
                throw new Error(`Unsupported provider: ${provider}`);
            }
        } catch (error) {
            console.error(`Error signing in with ${provider}:`, error);
            // Handle error state or display an error message
        }
    }

    return (
        <div>
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
            theme="light"
            transition={Bounce}
          />
            {isAboveMedium ? (
                <div className="flex flex-col items-center justify-center">
                    <h1 className='text-3xl my-10'>Sign In to Continue</h1>
                    <div className=''>
                        <form onSubmit={(e) => SignUp(e)}>
                            <input type="text" placeholder="Name" className="border rounded-lg border-black p-2 m-4 w-96" style={{ background: "#612C4F" }} name="name" onChange={(e) => { configUser(e) }} required/>
                            <br />
                            <input type="email" placeholder="Email" className="border rounded-lg border-black p-2 m-4 w-96" style={{ background: "#612C4F" }} name="email" onChange={(e) => { configUser(e) }} required/>
                            <br />
                            <input type="password" placeholder="Password" className="border rounded-lg border-black p-2 m-4 w-96" style={{ background: "#612C4F" }} name="password" onChange={(e) => { configUser(e) }} required minLength={6}/>
                            <br />
                            <div className='flex justify-between w-96'>
                               
                                {dloading ? (
                                <button className="border-2 border-black p-2 m-4 bg-red w-24">Sign Up</button>
                                ):(
                                    <button className="border-2 border-black p-2 m-4 bg-red w-24">
                                    <img
                                    src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                                    className="animate-spin h-8"
                                    viewBox="0 0 24 24"
                                  />
                                  </button>
                                )}
                            </div>
                        </form>
                        <br /><br />
                      {/*  <div className='flex justify-between w-full'>
                            <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-48 flex gap-4 hover:text-black hover:bg-white font-bold" onClick={() => { signAuth("google") }}>
                                <img src={"https://cdn-icons-png.flaticon.com/128/281/281764.png"} className='h-8' alt="Google Logo" />
                                <h1>Google Login</h1>
                            </button>
                            <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-48 flex gap-4 hover:text-black hover:bg-white font-bold" onClick={() => { signAuth("github") }}>
                                <img src={"https://cdn-icons-png.flaticon.com/128/5968/5968866.png"} className='h-8' alt="GitHub Logo" />
                                <h1>GitHub Login</h1>
                            </button>
                        </div>*/}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-start h-screen" style={{ overflowY: "scroll" }}>
                    <h1 className='text-3xl my-10'>Login to Continue</h1>
                    <div className=''>
                        <form onClick={(e) => { SignUp(e) }}>
                            <input type="text" placeholder="Name" className="border rounded-lg border-black p-2 m-4 w-72" style={{ background: "#612C4F" }} name="name" onChange={(e) => { configUser(e) }} required/>
                            <br />
                            <input type="email" placeholder="Email" className="border rounded-lg border-black p-2 m-4 w-72" style={{ background: "#612C4F" }} name="email" onChange={(e) => { configUser(e) }} required/>
                            <br />
                            <input type="password" placeholder="Password" className="border rounded-lg border-black p-2 m-4 w-72" style={{ background: "#612C4F" }} name="password" onChange={(e) => { configUser(e) }} required minLength={6}/>
                            <br />
                            <div className='flex justify-between w-72'>
                                <h1 className="p-2 m-4 bg-transparent">Forget Password {">"}</h1>
                                {dloading ? (
                                <button className="border-2 border-black p-2 m-4 bg-red w-24">Login</button>
                                ):(
                                    <button className="border-2 border-black p-2 m-4 bg-red w-24">
                                    <img
                                    src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                                    className="animate-spin h-8"
                                    viewBox="0 0 24 24"
                                  />
                                  </button>
                                )}
                            </div>
                        </form>
                     {/*   <div className='flex justify-between w-full'>
                            <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-32 flex gap-2 hover:text-black hover:bg-white font-bold text-sm" onClick={() => { signAuth("google") }}>
                                <img src={"https://cdn-icons-png.flaticon.com/128/281/281764.png"} className='h-8' alt="Google Logo" />
                                <h1>Google Login</h1>
                            </button>
                            <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-32 flex gap-2 hover:text-black hover:bg-white font-bold text-sm" onClick={() => { signAuth("github") }}>
                                <img src={"https://cdn-icons-png.flaticon.com/128/5968/5968866.png"} className='h-8' alt="GitHub Logo" />
                                <h1>GitHub Login</h1>
                            </button>
                        </div>*/}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Signup;
