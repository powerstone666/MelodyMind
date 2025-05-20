import React from 'react';
import useMediaQuery from "./useMedia";
import { FaEnvelope, FaGithub, FaLinkedin, FaInstagram, FaUser } from "react-icons/fa";
export default function AboutUs() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      title: "High Quality Audio",
      description: "Experience music in stunning clarity with our high-fidelity audio streaming"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Smart Recommendations",
      description: "Discover new music tailored to your taste with our intelligent recommendation system"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Community Features",
      description: "Connect with fellow music lovers and share your favorite tracks"
    }
  ];

  const profileLinks = [
    {
      component: <FaLinkedin className="text-2xl text-[#6b81ff]" />,
      url: "https://www.linkedin.com/in/imranpasha636/",
      label: "LinkedIn"
    },
    {
      component: <FaGithub className="text-2xl text-white" />,
      url: "https://github.com/powerstone666",
      label: "GitHub"
    },
    {
      component: <img src="https://media.geeksforgeeks.org/wp-content/uploads/20210628182253/gfglogo.png" alt="geekforgeeks" className="h-8" />,
      url: "https://www.geeksforgeeks.org/user/powerstone666",
      label: "GeeksforGeeks"
    },
    {
      component: <img src="https://cdn.iconscout.com/icon/free/png-512/leetcode-3628885-3030025.png" alt="leetcode" className="h-8" />,
      url: "https://leetcode.com/powerstone666/",
      label: "LeetCode"
    },
    {
      component: <FaEnvelope className="text-2xl text-emerald-300" />,
      url: "mailto:imranpasha8225@gmail.com",
      label: "Email"
    }
  ];

 

  return (
    <div className="min-h-screen w-full overflow-y-auto pb-48 pt-4 bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-500/20 mix-blend-plus-lighter blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 rounded-full bg-green-400/20 mix-blend-plus-lighter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 rounded-full bg-teal-500/20 mix-blend-plus-lighter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 mb-4">
              About MelodyMinds
            </h1>
            <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto">
              Where technology meets melody, creating your perfect musical experience
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900/50 to-green-800/50 backdrop-blur-sm border border-emerald-500/20 shadow-xl p-6 transform hover:scale-[1.02] transition-transform duration-300 animate-fadeInLeft">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-300 mb-3">Our Mission</h2>
                  <p className="text-emerald-100/80 leading-relaxed">
                    We're passionate about bringing the joy of music to your fingertips, making every note count and every playlist unforgettable. Our platform delivers exceptional sound quality, innovative features, and an unparalleled user experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900/50 to-green-800/50 backdrop-blur-sm border border-emerald-500/20 shadow-xl p-6 transform hover:scale-[1.02] transition-transform duration-300 animate-fadeInRight">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-300 mb-3">Join Our Community</h2>
                  <p className="text-emerald-100/80 leading-relaxed">
                    We're more than just an app – we're a vibrant community of music enthusiasts who share a common passion. Connect with fellow music lovers, share your playlists, and be part of something special.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900/30 to-green-800/30 backdrop-blur-sm border border-emerald-500/10 p-6 transform hover:scale-105 transition-all duration-300 animate-fadeInUp animation-delay-${index * 200}`}
              >
                <div className="text-emerald-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-emerald-300 mb-2">{feature.title}</h3>
                <p className="text-emerald-100/70">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Profile Links Section */}
          <div className="mt-12">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900/50 to-green-800/50 backdrop-blur-sm border border-emerald-500/20 shadow-xl p-8 text-center animate-fadeInUp">
              <h2 className="text-2xl font-bold text-emerald-300 mb-6">Connect With Me</h2>
              <div className="flex justify-center mt-8 gap-7">
                {profileLinks.map((profile, index) => (
                  <a
                    key={index}
                    href={profile.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-110 transition-transform group"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {profile.component}
                      <span className="text-sm text-emerald-200/70 group-hover:text-emerald-200 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {profile.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer Section */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-sm border border-red-500/20 shadow-xl p-6 mt-12 animate-fadeInUp">
            <h3 className="text-2xl font-bold text-red-300 mb-4">Disclaimer & Terms</h3>
            <div className="space-y-4 text-red-100/90">
              <p className="font-semibold">For Educational & Demonstration Purposes Only</p>
              <p>
                MelodyMinds is a non-commercial side project created to demonstrate software engineering skills. 
                It is not affiliated with any official streaming provider.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>This project is for personal learning and educational exploration only</li>
                <li>No copyrighted material is intentionally included or distributed</li>
                <li>All rights belong to their respective copyright holders</li>
                <li>This is a prototype and comes with no warranties or guarantees</li>
              </ul>
            </div>
          </div>

          {/* Bottom Spacing for Audio Player */}
          <div className="h-24" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
}