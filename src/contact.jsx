import React from 'react';
import { useForm } from "react-hook-form";
import linkedin from './assets/linkedin.png';
import github from './assets/github.png';
import gmail from './assets/gmail.png';
import contact from "./assets/contact.png";
import useMediaQuery from './useMedia';

const mystyle = {
  bg1: {
    backgroundImage: 'url("../src/assets/7tqQ0e.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    objectFit: "cover", // This line adds the object-fit property
    height: "100vh",
  },
};
export default function ContactUs() {
  const { register, handleSubmit, trigger, formState: { errors } } = useForm();
 const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const onSubmit = async (data, e) => {
    const isValid = await trigger();
    if (!isValid) {
      e.preventDefault();
    }
  };

  return (
    <div  style={mystyle.bg1}>{
    isAboveMedium ? (
     <div className='h-screen w-full flex justify-center gap-12 mt-24 '>
          <section className='w-1/3 ml-16'>
           <img src={contact} alt="contact" className="hover:filter hover:saturate-200 transition duration-500 mb-48"/>
          </section>
          <section className='w-2/3 flex-col'>
          <h1 className='text-2xl text-yellow font-bold ml-16'>CONTACT US</h1>
          <form target="_blank" onSubmit={onSubmit} method="post" action="https://formspree.io/f/mgegrqwy"> 
          <input type='text' placeholder='Name' className='w-1/2 h-12 mt-8 ml-16 bg-blue placeholder:text-deep-blue p-2' {...register("name", { required: true })} />
          <input type='email' placeholder='Email' className='w-1/2 h-12 mt-8 ml-16 bg-blue placeholder:text-deep-blue p-2' {...register("email", { required: true })} />
        <textarea placeholder='Message' className='w-1/2 h-32 mt-8 ml-16 bg-blue placeholder:text-deep-blue p-2' {...register("message", { required: true })} />
        <button type='submit' className='w-1/2 h-12 mt-8 ml-16  bg-yellow text-black'>Submit</button>
        </form>
        <div className="flex justify-start  my-10 gap-7 mx-24">
                <a className="hover:opacity-50 transition duration-500" href="https://www.linkedin.com/in/imranpasha636/" target="_blank" rel="noreferrer">
                <img src={linkedin} alt="linkedin"/>
                </a>
                <a className="hover:opacity-50 transition duration-500" href="https://github.com/powerstone666" target="_blank" rel="noreferrer">
                <img src={github} alt="github" className="h-8"/>
                </a>
                <a className="hover:opacity-50 transition duration-500" href="https://www.geeksforgeeks.org/user/powerstone666" target="_blank" rel="noreferrer">
                <img src="https://media.geeksforgeeks.org/wp-content/uploads/20210628182253/gfglogo.png" alt="geekforgeeks" className="h-8"/>
                </a>
                <a className="hover:opacity-50 transition duration-500" href="https://leetcode.com/powerstone666/" target="_blank" rel="noreferrer">
                <img src="https://cdn.iconscout.com/icon/free/png-512/leetcode-3628885-3030025.png" alt="leetcode" className="h-8"/>
                </a>
                <a className="hover:opacity-50 transition duration-500" href="mailto:imranpasha8225@gmail.com" target="_blank" rel="noreferrer">
                <img src={gmail} alt="gmail" className="h-8"/>
                </a>
        </div>
          </section>
     </div>
    ) : (
        <div className='h-screen w-full  mt-18 ' style={{overflowY:"scroll"}}>
          <section className='h-1/3 ml-12 p-4'>
           <img src={contact} alt="contact" className="hover:filter hover:saturate-200 transition duration-500 h-full "/>
          </section>
          <section className='h-2/3 flex-col'>
          <h1 className='text-2xl text-yellow font-bold ml-16'>CONTACT US</h1>
          <form target="_blank" onSubmit={onSubmit} method="post" action="https://formspree.io/f/mgegrqwy"> 
          <input type='text' placeholder='Name' className='w-1/2 h-12 mt-8 ml-16 bg-blue placeholder:text-deep-blue p-2' {...register("name", { required: true })} />
          <input type='email' placeholder='Email' className='w-1/2 h-12 mt-8 ml-16 bg-blue placeholder:text-deep-blue p-2' {...register("email", { required: true })} />
        <textarea placeholder='Message' className='w-1/2 h-32 mt-8 ml-16 bg-blue placeholder:text-deep-blue p-2' {...register("message", { required: true })} />
        <button type='submit' className='w-1/2 h-12 mt-4 ml-16  bg-yellow text-black'>Submit</button>
        </form>
        <div className="flex justify-start  my-8 gap-7 mx-24">
                <a className="hover:opacity-50 transition duration-500" href="https://www.linkedin.com/in/imranpasha636/" target="_blank" rel="noreferrer">
                <img src={linkedin} alt="linkedin" className='w-18 h-8'/>
                </a>
                <a className="hover:opacity-50 transition duration-500" href="https://github.com/powerstone666" target="_blank" rel="noreferrer">
                <img src={github} alt="github" className='w-18 h-8'/>
                </a>
                <a className="hover:opacity-50 transition duration-500" href="https://www.geeksforgeeks.org/user/powerstone666" target="_blank" rel="noreferrer">
                <img src="https://media.geeksforgeeks.org/wp-content/uploads/20210628182253/gfglogo.png" alt="geekforgeeks" className='w-18 h-8'/>
                </a>
                <a className="hover:opacity-50 transition duration-500" href="https://leetcode.com/powerstone666/" target="_blank" rel="noreferrer">
                <img src="https://cdn.iconscout.com/icon/free/png-512/leetcode-3628885-3030025.png" alt="leetcode" className='w-18 h-8'/>
                </a>
                <a className="hover:opacity-50 transition duration-500" href="mailto:imranpasha8225@gmail.com" target="_blank" rel="noreferrer">
                <img src={gmail} alt="gmail" className='w-18 h-8' />
                </a>
        </div>
          </section>
          <section className='h-72'>

          </section>
     </div>
      
    )
}
    </div>
  );
}
