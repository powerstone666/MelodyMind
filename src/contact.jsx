import React from 'react';
import { useForm } from "react-hook-form";
import { FaEnvelope, FaGithub, FaLinkedin, FaInstagram, FaUser } from "react-icons/fa";
import contact from "./assets/contact.png";
import useMediaQuery from './useMedia';
import bgimage from "../src/assets/7tqQ0e.jpg";
const mystyle = {
    bg1: {
      backgroundImage: `url(${bgimage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      objectFit: "cover",
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
    <div className="min-h-screen bg-gradient-to-br from-[#1e2746] via-[#232946] to-[#2d3250] flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl mx-auto animate-fadeIn">
        <div className="bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gradient-to-tr from-[#ff6b81] to-[#ffb86b] p-3 rounded-full text-white text-2xl shadow-lg"><FaEnvelope /></span>
            <h2 className="font-bold text-3xl">Contact Us</h2>
          </div>
          <form target="_blank" onSubmit={onSubmit} method="post" action="https://formspree.io/f/mgegrqwy" className="flex flex-col gap-4">
            <input type="text" placeholder="Name" className="rounded-lg px-4 py-3 bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:ring-2 focus:ring-[#ff6b81] outline-none" {...register("name", { required: true })} />
            <input type="email" placeholder="Email" className="rounded-lg px-4 py-3 bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:ring-2 focus:ring-[#ff6b81] outline-none" {...register("email", { required: true })} />
            <textarea placeholder="Message" className="rounded-lg px-4 py-3 bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:ring-2 focus:ring-[#ff6b81] outline-none min-h-[100px]" {...register("message", { required: true })} />
            <button type="submit" className="bg-gradient-to-r from-[#ffb86b] to-[#ff6b81] text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all">Submit</button>
          </form>
          <div className="flex justify-center mt-8 gap-7">
            <a className="hover:scale-110 transition-transform" href="https://www.linkedin.com/in/imranpasha636/" target="_blank" rel="noreferrer"><FaLinkedin className="text-2xl text-[#6b81ff]" /></a>
            <a className="hover:scale-110 transition-transform" href="https://github.com/powerstone666" target="_blank" rel="noreferrer"><FaGithub className="text-2xl text-white" /></a>
            <a className="hover:scale-110 transition-transform" href="https://www.geeksforgeeks.org/user/powerstone666" target="_blank" rel="noreferrer"><img src="https://media.geeksforgeeks.org/wp-content/uploads/20210628182253/gfglogo.png" alt="geekforgeeks" className="h-8" /></a>
            <a className="hover:scale-110 transition-transform" href="https://leetcode.com/powerstone666/" target="_blank" rel="noreferrer"><img src="https://cdn.iconscout.com/icon/free/png-512/leetcode-3628885-3030025.png" alt="leetcode" className="h-8" /></a>
            <a className="hover:scale-110 transition-transform" href="mailto:imranpasha8225@gmail.com" target="_blank" rel="noreferrer"><FaEnvelope className="text-2xl text-[#ff6b81]" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
