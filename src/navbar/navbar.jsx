import React, { useContext, useEffect, useState } from "react";
import useMediaQuery from "../useMedia";
import { Context } from "../context.js";
import searchicon from "../assets/searchicon.svg";
import close from "../assets/close-icon.svg";
import menubar from "../assets/menu.svg";
import { Link } from "react-router-dom";
import { getLanguages } from "../saavnapi";
import { auth } from "../Firebase/firebaseConfig";
import { Button } from "../components/UI";

function Navbar() {
  const { search, setSearch, setLanguage, languages, selected, setSelected } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const selectedStyle = `text-melody-pink-500 font-medium border-b-2 border-melody-pink-500`;
  const localUser = JSON.parse(localStorage.getItem("Users"));
  
  const searchquery = (e) => {
    setSearch(e.target.value);
  };
  
  const signout = async () => {
    await auth.signOut(auth);
    localStorage.removeItem("Users");
    window.location.reload();
  };
  
  const handleClick = (e) => {
    if (e.key === "Enter") {
      // Navigate to search results
    }
  };
  
  const clearSearch = () => {
    setSearch("");
  };
  
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("languages", selectedLanguage);
    window.location.reload();
  };
  
  useEffect(() => {
    getLanguages(languages);
  }, [languages]);
  
  return (
    <>
      {isAboveMedium ? (
        <section>
          <nav className="z-40 w-full p-4 backdrop-blur-md bg-black/30 sticky top-0">
            <div className="max-w-7xl mx-auto">
              <ul className="flex items-center gap-12 justify-start hover:cursor-pointer">
                <Link to="search">
                  <li className="flex items-center rounded-full bg-grey bg-opacity-50 w-96 h-10 px-4 transition-all duration-300 hover:bg-opacity-70 focus-within:ring-2 focus-within:ring-red focus-within:ring-opacity-50">
                    <img
                      src={searchicon}
                      alt="search icon"
                      className="w-5 h-5 mr-2"
                    />
                    <input
                      type="text"
                      placeholder="Search For Musics, Artists, Albums..."
                      className="h-full flex-grow bg-transparent outline-none"
                      onChange={(e) => searchquery(e)}
                      value={search}
                      onKeyDown={handleClick}
                    />
                    {search && (
                      <button 
                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-melody-pink-600/20 transition-colors"
                        onClick={clearSearch}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </li>
                </Link>
                
                <div className="flex items-center space-x-8">
                  <Link to="about">
                    <li
                      className={`${
                        selected === "/about" ? selectedStyle : "hover:text-melody-pink-500"
                      } py-2 px-1 transition-colors duration-300`}
                      onClick={() => {
                        localStorage.setItem("selected", "/about");
                        setSelected("/about");
                      }}
                    >
                      About
                    </li>
                  </Link>
                  
                  <Link to="contact">
                    <li
                      className={`${
                        selected === "/contact" ? selectedStyle : "hover:text-melody-pink-500"
                      } py-2 px-1 transition-colors duration-300`}
                      onClick={() => {
                        localStorage.setItem("selected", "/contact");
                        setSelected("/contact");
                      }}
                    >
                      Contact
                    </li>
                  </Link>
                  
                  <Link to="mood">
                    <li
                      className={`${
                        selected === "/mood" ? selectedStyle : "hover:text-melody-pink-500"
                      } py-2 px-1 transition-colors duration-300`}
                      onClick={() => {
                        localStorage.setItem("selected", "/mood");
                        setSelected("/mood");
                      }}
                    >
                      Mood
                    </li>
                  </Link>
                </div>
                
                <div className="ml-auto flex items-center space-x-4">
                  <select
                    onChange={handleLanguageChange}
                    className="bg-deep-grey text-white py-2 px-3 rounded-md outline-none cursor-pointer border border-gray-700 focus:border-red transition-colors"
                  >
                    <option value="hindi,english">Hindi & English</option>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                    <option value="marathi">Marathi</option>
                    <option value="gujarati">Gujarati</option>
                    <option value="bengali">Bengali</option>
                    <option value="kannada">Kannada</option>
                    <option value="bhojpuri">Bhojpuri</option>
                    <option value="malayalam">Malayalam</option>
                    <option value="urdu">Urdu</option>
                    <option value="haryanvi">Haryanvi</option>
                    <option value="rajasthani">Rajasthani</option>
                    <option value="odia">Odia</option>
                    <option value="assamese">Assamese</option>
                  </select>
                  
                  {localUser ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold">{localUser.displayName}</span>
                        <span className="text-xs text-gray-400">{localUser.email}</span>
                      </div>
                      <img
                        src={localUser.photoURL || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
                        alt="User"
                        className="h-10 w-10 rounded-full border-2 border-red"
                      />
                      <Button 
                        variant="outline" 
                        onClick={signout}
                        className="text-sm"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <Link to="login">
                        <Button variant="primary">Login</Button>
                      </Link>
                      <Link to="signup">
                        <Button variant="secondary">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </ul>
            </div>
          </nav>
        </section>
      ) : (
        <section className="relative w-full">
          <nav className="z-40 w-full p-4 backdrop-blur-md bg-black/30 sticky top-0">
            <div className="flex items-center justify-between">
              <h1 className="bg-gradient-rainblue text-transparent bg-clip-text text-2xl font-bold">
                MelodyMind
              </h1>
              
              <div className="flex items-center space-x-2">
             
                
                <select
                  className="p-2 bg-deep-grey rounded-md outline-none border-none text-sm"
                  value={languages}
                  onChange={handleLanguageChange}
                >
                  <option className="bg-deep-grey" value="hindi,english">Hindi & English</option>
                  <option className="bg-deep-grey" value="hindi">Hindi</option>
                  <option className="bg-deep-grey" value="english">English</option>
                  <option className="bg-deep-grey" value="punjabi">Punjabi</option>
                  <option className="bg-deep-grey" value="tamil">Tamil</option>
                  <option className="bg-deep-grey" value="telugu">Telugu</option>
                </select>
                
                <button 
                  className="p-2 rounded-full bg-deep-grey"
                  onClick={() => setIsMenuToggled(!isMenuToggled)}
                >
                  <img src={isMenuToggled ? close : menubar} alt="menu" className="w-5 h-5" />
                </button>
              </div>
            </div>
              {/* Mobile menu */}
            {isMenuToggled && (
              <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-4 w-56 z-50 animate-fadeIn">
                <ul className="space-y-3">
                  <Link to="/">
                    <li 
                      className={`${selected === "/" ? "text-melody-pink-500" : ""} hover:text-melody-pink-500 p-2 rounded transition-colors`}
                      onClick={() => {
                        localStorage.setItem("selected", "/");
                        setSelected("/");
                        setIsMenuToggled(false);
                      }}
                    >
                      Home
                    </li>
                  </Link>
                  <Link to="contact">
                    <li 
                      className={`${selected === "/contact" ? "text-melody-pink-500" : ""} hover:text-melody-pink-500 p-2 rounded transition-colors`}
                      onClick={() => {
                        localStorage.setItem("selected", "/contact");
                        setSelected("/contact");
                        setIsMenuToggled(false);
                      }}
                    >
                      Contact
                    </li>
                  </Link>                  <Link to="mood">
                    <li 
                      className={`${selected === "/mood" ? "text-melody-pink-500" : ""} hover:text-melody-pink-500 p-2 rounded transition-colors`}
                      onClick={() => {
                        localStorage.setItem("selected", "/mood");
                        setSelected("/mood");
                        setIsMenuToggled(false);
                      }}
                    >
                      Mood
                    </li>
                  </Link>
                  
                  <Link to="recent">
                    <li 
                      className={`${selected === "/recent" ? "text-melody-pink-500" : ""} hover:text-melody-pink-500 p-2 rounded transition-colors`}
                      onClick={() => {
                        localStorage.setItem("selected", "/recent");
                        setSelected("/recent");
                        setIsMenuToggled(false);
                      }}
                    >
                      Recents
                    </li>
                  </Link>
                    {localUser ? (
                    <>
                      <Link to="profile">
                        <li 
                          className={`${selected === "/profile" ? "text-melody-pink-500" : ""} hover:text-melody-pink-500 p-2 rounded transition-colors`}
                          onClick={() => {
                            localStorage.setItem("selected", "/profile");
                            setSelected("/profile");
                            setIsMenuToggled(false);
                          }}
                        >
                          Profile
                        </li>
                      </Link>

                      <div className="border-t border-gray-700 my-2 pt-2">
                        <div className="flex items-center space-x-2 p-2">
                          <img
                            src={localUser.photoURL || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
                            alt="User"
                            className="h-8 w-8 rounded-full border border-red"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">{localUser.displayName}</span>
                            <span className="text-xs text-gray-400 truncate max-w-[120px]">{localUser.email}</span>
                          </div>
                        </div>
                        <button 
                          className="w-full mt-2 p-2 text-sm text-melody-pink-500 hover:bg-melody-pink-600/20 rounded transition-colors"
                          onClick={signout}
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="border-t border-gray-700 my-2 pt-2 flex flex-col space-y-2">
                      <Link to="login">                        <button className="w-full p-2 bg-melody-pink-600 text-white rounded-md text-sm hover:bg-melody-pink-500 shadow-md shadow-melody-pink-600/20 transition-colors">
                          Login
                        </button>
                      </Link>
                      <Link to="signup">                        <button className="w-full p-2 bg-melody-purple-800 border border-melody-pink-500 text-melody-pink-500 rounded-md text-sm hover:bg-melody-pink-600/10 transition-colors">
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </nav>
        </section>
      )}
    </>
  );
}

export default Navbar;
