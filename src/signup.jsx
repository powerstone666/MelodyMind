import React from 'react';
import useMediaQuery from './useMedia';
import {auth,googleProvider,appleProvider} from './Firebase/firebaseConfig';
import { createUserWithEmailAndPassword,signOut,signInWithPopup,OAuthProvider, signInWithRedirect,updateProfile } from 'firebase/auth';
import {useState} from 'react';
import { Context } from './main';
import { useContext } from 'react';
function Signup(){
    const {Users,setUsers}=useContext(Context);
    const [user,setUser]=useState({name:"",email:"",password:""});
    const isAboveMedium = useMediaQuery("(min-width: 768px)");
    const configUser=(e)=>{
        setUser({...user,[e.target.name]:e.target.value});
    }
   
  const SignUp=async(e)=>{
    e.preventDefault();
    console.log(user.name+" "+user.email+" "+user.password)
    const res=await createUserWithEmailAndPassword(auth,user.email,user.password)
    const User=res.user;

    // Update the user's profile with the display name
    await updateProfile(User, {
      displayName:user.name
    });

  }

  
    const signAuth=async (provider)=>{

        if(provider==="google"){
           await signInWithRedirect(auth,googleProvider)
           localStorage.setItem("Users", JSON.stringify(res.user));

           // Retrieve the user information from localStorage
           const localUser = JSON.parse(localStorage.getItem("Users"));
           setUsers(localUser);
        }
        else{
          await signInWithRedirect(auth,appleProvider)
          localStorage.setItem("Users", JSON.stringify(res.user));

          // Retrieve the user information from localStorage
          const localUser = JSON.parse(localStorage.getItem("Users"));
          setUsers(localUser);
        }
    }
    return(
        <div>
        {   isAboveMedium ? (
                  <div className=" flex flex-col items-center justify-center">
                    <div>
                    <h1 className='text-3xl my-10'>SignIn TO CONTINUE</h1>
                    </div>
                    <div className=''>
                        <form onSubmit={(e)=>SignUp(e)}> 
                        <input type="text" placeholder="Name" className="border rounded-lg  border-black p-2 m-4 w-96" style={{background:"#612C4F"}} name="name" onChange={(e)=>{configUser(e)}}/>
                        <br/>
                            <input type="email" placeholder="Email" className="border rounded-lg  border-black p-2 m-4 w-96" style={{background:"#612C4F"}} name="email" onChange={(e)=>{configUser(e)}}/>
                            <br/>
                            <input type="password" placeholder="Password" className="border rounded-lg border-black p-2 m-4 w-96" style={{background:"#612C4F"}} name="password" onChange={(e)=>{configUser(e)}} />
                            <br/>
                            <div className='flex justify-between w-96'>
                            <h1 className=" p-2 m-4 bg-transparent" >Forget Password {">"}</h1>
                            <button className="border-2 border-black p-2 m-4 bg-red w-24">Login</button>
                            </div>
                        </form>
                           <br/><br/>
                           <div className='flex justify-between w-full'>
                           <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-48 flex gap-4 hover:text-black hover:bg-white font-bold" onClick={()=>{signAuth("google")}}><img src={"https://cdn-icons-png.flaticon.com/128/281/281764.png" } className='h-8'/><h1>Google Login</h1></button>
                           <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-48 flex gap-4 hover:text-black hover:bg-white font-bold" onClick={()=>{signAuth("github")}}><img src={"https://cdn-icons-png.flaticon.com/128/5968/5968866.png" } className='h-8'/><h1>GitHub Login</h1></button>
                            </div>
                        </div>
                    </div>
                ):
                (
                    <div className=" flex flex-col items-center justify-start h-screen" style={{overflowY:"scroll"}}>
                    <div>
                    <h1 className='text-3xl my-10'>LOGIN TO CONTINUE</h1>
                    </div>
                    <div className=''>
                        <form onClick={(e)=>{SignUp(e)}}>
                        <input type="text" placeholder="Name" className="border rounded-lg  border-black p-2 m-4 w-72" style={{background:"#612C4F"}} name="name" onChange={(e)=>{configUser(e)}}/>
                        <br/>
                            <input type="email" placeholder="Email" className="border rounded-lg  border-black p-2 m-4 w-72" style={{background:"#612C4F"}} name="email" onChange={(e)=>{configUser(e)}}/>
                            <br/>
                            <input type="password" placeholder="Password" className="border rounded-lg border-black p-2 m-4 w-72" style={{background:"#612C4F"}} name="password" onChange={(e)=>{configUser(e)}} />
                            <br/>
                            <div className='flex justify-between w-96'>
                            <h1 className=" p-2 m-4 bg-transparent">Forget Password {">"}</h1>
                            <button className="border-2 border-black p-2 m-4 bg-red w-24">Login</button>
                            </div>
                        </form>
                       
                           <div className='flex justify-between w-full'>
                           <div className='flex justify-between w-full'>
                           <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-32 flex gap-2 hover:text-black hover:bg-white font-bold text-sm" onClick={()=>{signAuth("google")}}><img src={"https://cdn-icons-png.flaticon.com/128/281/281764.png" } className='h-8'/><h1>Google Login</h1></button>
                           <button className="border-2 rounded-lg p-2 m-4 bg-transparent w-32 flex gap-2 hover:text-black hover:bg-white font-bold text-sm" onClick={()=>{signAuth("github")}}><img src={"https://cdn-icons-png.flaticon.com/128/5968/5968866.png" } className='h-8'/><h1>GitHub Login</h1></button>
                            </div> 

                            </div> 
                        </div>
                    
                    </div>
                )
        }
        </div>
    )
}
export default Signup;