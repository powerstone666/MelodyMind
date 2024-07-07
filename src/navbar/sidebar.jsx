import useMediaQuery from "../useMedia";
import artist from "../assets/artist.svg";
import close from "../assets/close-icon.svg";
import search from "../assets/searchicon.svg";
import library from "../assets/library.svg";
import discover from "../assets/discover.svg";
import home from "../assets/home.svg";
import albums from "../assets/album.svg";
import liked from "../assets/liked.svg";
import logout from "../assets/logout.svg";
import recent from "../assets/recent.svg";
import { auth } from "../Firebase/firebaseConfig";
import { createUserWithEmailAndPassword,signOut,signInWithPopup,OAuthProvider, signInWithRedirect,updateProfile } from 'firebase/auth';
import AudioPlayer from "../AudioPlayer/audioplayer";
import { useContext } from "react";
import { Context } from "../main";
import { Link } from "react-router-dom";
function Sidebar() {
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const localUser = JSON.parse(localStorage.getItem("Users"));
  const selectedStyle = `text-red  `;
  const {selected,setSelected}=useContext(Context)
  const signout=async()=>{
    await auth.signOut(auth);
      localStorage.removeItem("Users");
      window.location.reload();
     }
  return (
    <>
      {isAboveMedium ? (
        <aside className="w-42 bg-deep-blue h-screen">
          <h1 className="bg-gradient-rainbow text-transparent bg-clip-text text-2xl p-6 font-bold ">
            MelodyMind
          </h1>
          <div className=" align-middle justify-center items-center p-8 hover:cursor-pointer">
            <h1 className="text-red mb-4">Menu</h1>
            <Link to="/">
            <div className="p-2 flex">
              <img src={home} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "/" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "/");
                  setSelected("/");
                }}
              >
                Home
              </h1>
            </div>
            </Link>
            <Link to="/discover">
            <div className="p-2 flex">
              <img src={discover} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "/discover" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "/discover");
                  setSelected("/discover");
                }}
              >
                Discover
              </h1>
            </div>
            </Link>
            <Link to="/albums">
            <div className="p-2 flex">
              <img src={albums} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "/albums" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "/albums");
                  setSelected("/albums");
                }}
              >
                Albums
              </h1>
            </div>
            </Link>
            <Link to="/artist">
            <div className="p-2 flex">
              <img src={artist} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "/artist" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "/artist");
                  setSelected("/artist");
                }}
              >
                Artist
              </h1>
            </div>
            </Link>
          
            <h1 className="text-red mb-4 mt-4">Library</h1>
            <Link to="/recently">
            <div className="p-2 flex">
              <img src={recent} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "/recently" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "/recently");
                  setSelected("/recently");
                }}
              >
                Recently
              </h1>
            </div>
            </Link>
            <Link to="/liked">
            <div className="p-2 flex">
              <img src={liked} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "/liked" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "/liked");
                  setSelected("/liked");
                }}
              >
                Liked
              </h1>
            </div>
          </Link>
           
            {localUser && (
              <>
               <h1 className="text-red mb-4 mt-2">General</h1>
            <div className="p-2 flex" onClick={signout}>
              <img src={logout} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "logout" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                >
                Logout
              </h1>
            </div>
            </>
            )}
            
            </div>
        </aside>
      ) : (
        <footer className="fixed bottom-0 w-full bg-deep-blue h-20 z-40">
          <nav className="flex gap-8 p-2 items-center justify-center">
            <Link to="/">
            <div
              onClick={() => {
                localStorage.setItem("selected", "/");
                setSelected("/");
              }}
            >
              <img src={home} alt="search icon" className="p-2" />
              <h2
                className={`${
                  selected === "/" ? selectedStyle : "hover:text-red"
                } `}
              >
                Home
              </h2>
            </div>
            </Link>
            <Link to="/discover">
            <div
              onClick={() => {
                localStorage.setItem("selected", "/discover");
                setSelected("/discover");
              }}
            >
              <img src={discover} alt="search icon" className="p-2" />
              <h2
                className={`${
                  selected === "/discover" ? selectedStyle : "hover:text-red"
                } `}
              >
                Discover
              </h2>
            </div>
            </Link>
            <Link to="/albums">
            <div
              onClick={() => {
                localStorage.setItem("selected", "/albums");
                setSelected("/albums");
              }}
            >
              <img src={albums} alt="search icon" className="p-2 " />
              <h2
                className={`${
                  selected === "/albums" ? selectedStyle : "hover:text-red"
                } `}
              >
                Albums
              </h2>
            </div>
            </Link>
            <Link to="/liked">
            <div
              onClick={() => {
                localStorage.setItem("selected", "/liked");
                setSelected("/liked");
              }}
            >
              <img src={library} alt="search icon" className="p-2" />
              <h2
                className={`${
                  selected === "/liked" ? selectedStyle : "hover:text-red"
                } `}
              >
                Library
              </h2>
            </div>
            </Link>
            <Link to="/search">
            <div
              onClick={() => {
                localStorage.setItem("selected", "/search");
                setSelected("/search");
              }}
            >
              <img src={search} alt="search icon" className="p-2" />
              <h2
                className={`${
                  selected === "/search" ? selectedStyle : "hover:text-red"
                } `}
              >
                search
              </h2>
            </div>
            </Link>
          </nav>
        </footer>
      )}
    </>
  );
}
export default Sidebar;
