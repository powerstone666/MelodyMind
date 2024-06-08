import React, { useContext, useEffect, useState } from "react";
import menubar from "../assets/menu.svg";
import useMediaQuery from "../useMedia";
import { Context } from "../main";
import close from "../assets/close-icon.svg";
import searchicon from "../assets/searchicon.svg";
import Search from "../Search/search";
import { getLanguages } from "../saavnapi";
function Navbar({ selected, setSelected }) {
  
  const { search, setSearch, setLanguage, languages} = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const selectedStyle = `text-red  `;
  const searchquery = (e) => {
    setSearch(e.target.value);
  };
  const handleClick = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
      localStorage.setItem("selected", "search");
      setSelected("search");
    }
  };
  const clearSearch = () => {
    setSearch(""); // Clear the search query
  };
  const handleLanguageChange =(event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("languages", selectedLanguage);
    window.location.reload();
  };
  useEffect(() => {
  getLanguages(languages)
  },[languages]);
  return (
    <>
      {isAboveMedium ? (
        <section>
          <nav className="z-40 w-full p-4">
            <ul className="flex items-center gap-12 justify-center hover:cursor-pointer">
              <li className="flex rounded-md bg-grey w-96 h-8">
                <img
                  src={searchicon}
                  alt="search icon"
                  className="p-2"
                  onClick={() => {
                    localStorage.setItem("selected", "search");
                    setSelected("search");
                  }}
                />
                <input
                  type="text"
                  placeholder="Search For Musics, Artists, Albums..."
                  className="p-4 h-8 w-80 bg-transparent outline-none "
                  onChange={(e) => searchquery(e)}
                  value={search}
                  onKeyDown={handleClick}
                  onClick={() => {
                    localStorage.setItem("selected", "search");
                    setSelected("search");
                  }}
                />
                {search && (
                  <button className="text-blue" onClick={clearSearch}>
                    X
                  </button>
                )}
              </li>
              <li
                className={`${
                  selected === "about" ? selectedStyle : "hover:text-red"
                }`}
                onClick={() => {
                  localStorage.setItem("selected", "about");
                  setSelected("about");
                }}
              >
                About
              </li>
              <li
                className={`${
                  selected === "contact" ? selectedStyle : "hover:text-red"
                }`}
                onClick={() => {
                  localStorage.setItem("selected", "contact");
                  setSelected("contact");
                }}
              >
                Contact
              </li>
              <li
                className={`${
                  selected === "mood" ? selectedStyle : "hover:text-red"
                }`}
                onClick={() => {
                  localStorage.setItem("selected", "mood");
                  setSelected("mood");
                }}
              >
                Mood Analyse
              </li>
              <select
                className={`w-24 h-8 border-0 rounded-md hover:shadow-md bg-transparent text-red outline-none`}
                value={languages}
                onChange={handleLanguageChange}
              >
              
                <option className="bg-deep-grey" value="hindi">
                  Hindi
                </option>
                <option className="bg-deep-grey" value="english">
                  English
                </option>
                <option className="bg-deep-grey" value="tamil">
                  Tamil
                </option>
                <option className="bg-deep-grey" value="telugu">
                  Telugu
                </option>
                <option className="bg-deep-grey" value="urdu">
                  Urdu
                </option>
                <option className="bg-deep-grey" value="punjabi">
                  Punjabi
                </option>
              </select>
              <button
                className="bg-deep-grey w-24 h-8 border-0 rounded-md text-red hover:shadow-md hover:shadow-red"
                onClick={() => {
                  localStorage.setItem("selected", "login");
                  setSelected("login");
                }}
              >
                Login
              </button>
              <button
                className="bg-red w-24 h-8 border-0 rounded-md text-deep-grey hover:shadow-md hover:shadow-deep-blue"
                onClick={() => {
                  localStorage.setItem("selected", "signup");
                  setSelected("signup");
                }}
              >
                Sign Up
              </button>
            </ul>
          </nav>
        </section>
      ) : (
        <section className="flex justify-end relative right-0">
          {/*need to be fixed*/}
          <nav className="z-40 w-full  p-4">
            <ul className="flex items-center ">
              <li>
                <h1 className="bg-gradient-rainbow text-transparent bg-clip-text text-2xl p-6 font-bold text-red">
                  MelodyMind
                </h1>
              </li>
              <li>
              <select
                className={`w-24 h-8 border-0 rounded-md hover:shadow-md bg-transparent text-red outline-none`}
                value={languages}
                onChange={handleLanguageChange}
              >
              
                <option className="bg-deep-grey" value="hindi">
                  Hindi
                </option>
                <option className="bg-deep-grey" value="english">
                  English
                </option>
                <option className="bg-deep-grey" value="tamil">
                  Tamil
                </option>
                <option className="bg-deep-grey" value="telugu">
                  Telugu
                </option>
                <option className="bg-deep-grey" value="urdu">
                  Urdu
                </option>
                <option className="bg-deep-grey" value="punjabi">
                  Punjabi
                </option>
              </select>
              </li>
              <img
                src={menubar}
                alt="menu icon"
                className="p-2 hover:cursor-pointer"
                onClick={() => setIsMenuToggled(true)}
              />
            </ul>
          </nav>
        </section>
      )}
      {isMenuToggled && !isAboveMedium && (
        <section className="w-5/6 bg-deep-blue h-screen right-0 bottom-0 fixed z-40">
          <div className="flex justify-end p-4 mt-16">
            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
              <img
                src={close}
                alt="close"
                className="w-6 hover:cursor-pointer"
              />
            </button>
          </div>
          <h1 className="bg-gradient-rainbow text-transparent bg-clip-text text-2xl p-6 font-bold text-red">
            MelodyMind
          </h1>
          
          <div className="align-middle justify-center items-center p-8 hover:cursor-pointer">
            <div
              className="p-2"
              onClick={() => {
                localStorage.setItem("selected", "about");
                setSelected("about");
              }}
            >
              <h1
                className={`${
                  selected === "about" ? selectedStyle : "hover:text-red"
                }text-xl`}
              >
                About
              </h1>
            </div>
            <div
              className="p-2"
              onClick={() => {
                localStorage.setItem("selected", "contact");
                setSelected("contact");
              }}
            >
              <h1
                className={`${
                  selected === "contact" ? selectedStyle : "hover:text-red"
                }text-xl`}
              >
                Contact
              </h1>
            </div>
            <div
              className="p-2"
              onClick={() => {
                localStorage.setItem("selected", "mood");
                setSelected("mood");
              }}
            >
              <h1
                className={`${
                  selected === "mood" ? selectedStyle : "hover:text-red"
                }text-xl`}
              >
                Mood Analyser
              </h1>
            </div>
            <div
              className="p-2"
              onClick={() => {
                localStorage.setItem("selected", "recently");
                setSelected("recently");
              }}
            >
              <h1
                className={`${
                  selected === "recently" ? selectedStyle : "hover:text-red"
                }text-xl`}
              >
                Recently
              </h1>
            </div>

            <div
              onClick={() => {
                localStorage.setItem("selected", "login");
                setSelected("login");
              }}
            >
              <button className="p-2 text-xl text-blue">Login</button>
            </div>
            <div
              onClick={() => {
                localStorage.setItem("selected", "signup");
                setSelected("signup");
              }}
            >
              <button className="p-2 text-xl text-orange-500">Sign Up</button>
            </div>
            <div className="p-2 text-xl">logout</div>
          </div>
        </section>
      )}
    </>
  );
}

export default Navbar;
