import React, { useContext } from 'react';
import useMediaQuery from './useMedia';
import {useState} from 'react';
import {auth,googleProvider,appleProvider} from './Firebase/firebaseConfig';
import { createUserWithEmailAndPassword,signOut,signInWithRedirect,OAuthProvider,signInWithEmailAndPassword,signInWithPopup } from 'firebase/auth';
import { Context } from './main';
import { set } from 'react-hook-form';
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Login(){
    const {Users,setUsers}=useContext(Context);
    const isAboveMedium = useMediaQuery("(min-width: 768px)");
    const [user,setUser]=useState({email:"",password:""});
    const [dloading,setDloading]=useState(true);
    const signAuth = async (provider) => {
        try {
            let res;
            if (provider === "google") {
                res = await signInWithPopup(auth, googleProvider);
            } else if (provider === "apple") {
                res = await signInWithPopup(auth, appleProvider);
            } else {
                // Handle other providers as needed
                throw new Error(`Unsupported provider: ${provider}`);
            }
    
            // Update local storage and state
            localStorage.setItem("Users", JSON.stringify(res.user));
            setUsers(res.user);
        } catch (error) {
            console.error(`Error signing in with ${provider}:`, error);
            // Handle error state or display an error message
        }
    }
        
    const signin=(e)=>{
        setUser({...user,[e.target.name]:e.target.value});
    }
    const onsubmit=async(e)=>{
        try{
         setDloading(false);
        e.preventDefault();
      const res=  await signInWithEmailAndPassword(auth,user.email,user.password)
      localStorage.setItem("Users", JSON.stringify(res.user));

      // Retrieve the user information from localStorage
      const localUser = JSON.parse(localStorage.getItem("Users"));
      setUsers(localUser);
  
          setDloading(true);
        }   
        catch(error){
            console.log(error);
            toast.error("Wrong Password or Email");
            setDloading(true);
        }
    }
    return(
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
        {   isAboveMedium ? (
                  <div className=" flex flex-col items-center justify-center">
                    <div>
                    <h1 className='text-3xl my-10'>LOGIN TO CONTINUE</h1>
                    </div>
                    <div className=''>
                        <form onSubmit={(e)=>{onsubmit(e)}}>
                            <input type="email" placeholder="Email" className="border rounded-lg  border-black p-2 m-4 w-96" style={{background:"#612C4F"}} name="email" onChange={(e)=>{signin(e)}} required/>
                            <br/>
                            <input type="password" placeholder="Password" className="border rounded-lg border-black p-2 m-4 w-96" style={{background:"#612C4F"}} name="password" onChange={(e)=>{signin(e)}} required minLength={6}/>
                            <br/>
                            <div className='flex justify-between w-96'>
                            <h1 className=" p-2 m-4 bg-transparent">Forget Password {">"}</h1>
                            {dloading?(
                            <button className="border-2 border-black p-2 m-4 bg-red w-24">Login</button>
                            ):(
                                <button  className="border-2 border-black p-2 m-4 bg-red w-24">
                                <img
                                src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                                className="animate-spin h-8"
                                viewBox="0 0 24 24"
                              />
                              </button>
                            )}
                            </div>
                        </form>
                           <br/><br/>
                       {/*    <div className='flex justify-between w-full'>
                           <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-48 flex gap-4 hover:text-black hover:bg-white font-bold" onClick={()=>{signAuth("google")}}><img src={"https://cdn-icons-png.flaticon.com/128/281/281764.png" } className='h-8'/><h1>Google Login</h1></button>
                           <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-48 flex gap-4 hover:text-black hover:bg-white font-bold" onClick={()=>{signAuth("github")}}><img src={"https://cdn-icons-png.flaticon.com/128/5968/5968866.png" } className='h-8'/><h1>GitHub Login</h1></button>
                            </div> */}
                        </div>
                    </div>
                ):
                (
                    <div className=" flex flex-col items-center justify-center">
                    <div>
                    <h1 className='text-3xl my-10'>LOGIN TO CONTINUE</h1>
                    </div>
                    <div className=''>
                        <form onSubmit={(e)=>{onsubmit(e)}}>
                            <input type="email" placeholder="Email" className="border rounded-lg  border-black p-2 m-4 w-72" name="email"style={{background:"#612C4F"}} onChange={(e)=>{signin(e)}} required/>
                            <br/>
                            <input type="password" placeholder="Password" className="border rounded-lg border-black p-2 m-4 w-72" name="password" style={{background:"#612C4F"}} onChange={(e)=>{signin(e)}} required minLength={6}/>
                            <br/>
                            <div className='flex justify-between w-96'>
                            <h1 className=" p-2 m-4 bg-transparent">Forget Password {">"}</h1>
                            {dloading?(
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
                        <br/><br/>
                       {/* <div className='flex justify-between w-full'>
                           <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-32 flex gap-2 hover:text-black hover:bg-white font-bold text-sm" onClick={()=>{signAuth("google")}}><img src={"https://cdn-icons-png.flaticon.com/128/281/281764.png" } className='h-8'/><h1>Google Login</h1></button>
                           <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-32 flex gap-2 hover:text-black hover:bg-white font-bold text-sm" onClick={()=>{signAuth("github")}}><img src={"https://cdn-icons-png.flaticon.com/128/5968/5968866.png" } className='h-8'/><h1>GitHub Login</h1></button>
                            </div> */}
                        </div>
                    </div>
                )
        }
        </div>
    )
}
export default Login;