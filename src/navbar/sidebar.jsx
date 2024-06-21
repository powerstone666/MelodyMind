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
import AudioPlayer from "../AudioPlayer/audioplayer";
import { useContext } from "react";
import { Context } from "../main";
function Sidebar() {
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const selectedStyle = `text-red  `;
  const {selected,setSelected}=useContext(Context)
  return (
    <>
      {isAboveMedium ? (
        <aside className="w-42 bg-deep-blue h-screen">
          <h1 className="bg-gradient-rainbow text-transparent bg-clip-text text-2xl p-6 font-bold ">
            MelodyMind
          </h1>
          <div className=" align-middle justify-center items-center p-8 hover:cursor-pointer">
            <h1 className="text-red mb-4">Menu</h1>
            <div className="p-2 flex">
              <img src={home} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "home" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "home");
                  setSelected("home");
                }}
              >
                Home
              </h1>
            </div>
            <div className="p-2 flex">
              <img src={discover} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "discover" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "discover");
                  setSelected("discover");
                }}
              >
                Discover
              </h1>
            </div>
            <div className="p-2 flex">
              <img src={albums} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "albums" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "albums");
                  setSelected("albums");
                }}
              >
                Albums
              </h1>
            </div>
            <div className="p-2 flex">
              <img src={artist} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "artist" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "artist");
                  setSelected("artist");
                }}
              >
                Artist
              </h1>
            </div>
            <h1 className="text-red mb-4 mt-4">Library</h1>
            <div className="p-2 flex">
              <img src={recent} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "recently" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "recently");
                  setSelected("recently");
                }}
              >
                Recently
              </h1>
            </div>
            <div className="p-2 flex">
              <img src={liked} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "liked" ? selectedStyle : "hover:text-red"
                } text-2xl`}
                onClick={() => {
                  localStorage.setItem("selected", "liked");
                  setSelected("liked");
                }}
              >
                Liked
              </h1>
            </div>
            <h1 className="text-red mb-4 mt-2">General</h1>
            <div className="p-2 flex">
              <img src={logout} alt="search icon" className="mr-2" />
              <h1
                className={`${
                  selected === "logout" ? selectedStyle : "hover:text-red"
                } text-2xl`}
              >
                Logout
              </h1>
            </div>
          </div>
        </aside>
      ) : (
        <footer className="fixed bottom-0 w-full bg-deep-blue h-20 z-40">
          <nav className="flex gap-8 p-2 items-center justify-center">
            <div
              onClick={() => {
                localStorage.setItem("selected", "home");
                setSelected("home");
              }}
            >
              <img src={home} alt="search icon" className="p-2" />
              <h2
                className={`${
                  selected === "home" ? selectedStyle : "hover:text-red"
                } `}
              >
                Home
              </h2>
            </div>
            <div
              onClick={() => {
                localStorage.setItem("selected", "discover");
                setSelected("discover");
              }}
            >
              <img src={discover} alt="search icon" className="p-2" />
              <h2
                className={`${
                  selected === "discover" ? selectedStyle : "hover:text-red"
                } `}
              >
                Discover
              </h2>
            </div>
            <div
              onClick={() => {
                localStorage.setItem("selected", "albums");
                setSelected("albums");
              }}
            >
              <img src={albums} alt="search icon" className="p-2 " />
              <h2
                className={`${
                  selected === "albums" ? selectedStyle : "hover:text-red"
                } `}
              >
                Albums
              </h2>
            </div>
            <div
              onClick={() => {
                localStorage.setItem("selected", "liked");
                setSelected("liked");
              }}
            >
              <img src={library} alt="search icon" className="p-2" />
              <h2
                className={`${
                  selected === "liked" ? selectedStyle : "hover:text-red"
                } `}
              >
                Library
              </h2>
            </div>
            <div
              onClick={() => {
                localStorage.setItem("selected", "search");
                setSelected("search");
              }}
            >
              <img src={search} alt="search icon" className="p-2" />
              <h2
                className={`${
                  selected === "search" ? selectedStyle : "hover:text-red"
                } `}
              >
                search
              </h2>
            </div>
          </nav>
        </footer>
      )}
    </>
  );
}
export default Sidebar;
