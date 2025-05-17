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
import login from "../assets/user.svg"; // Login icon
import { logoutUser } from "../Firebase/auth";
import AudioPlayer from "../AudioPlayer/audioplayer";
import { useContext } from "react";
import { Context } from "../context.js";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Sidebar() {
  const { selected, setSelected, Users, setUsers } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");
  const navigate = useNavigate();
  const selectedStyle = `text-melody-pink-500`;
  
  const handleSignout = async () => {
    try {
      await logoutUser();
      setUsers("");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      {isAboveMedium ? (
        <aside className="w-42 bg-deep-blue h-screen">
          <h1 className="bg-gradient-rainbow text-transparent bg-clip-text text-2xl p-6 font-bold ">
            MelodyMind
          </h1>
          <div className=" align-middle justify-center items-center p-8 hover:cursor-pointer">
            <h1 className="text-melody-pink-500 mb-4">Menu</h1>
            <Link to="/">
              <div className="p-2 flex">
                <img src={home} alt="home icon" className="mr-2" />
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
                <img src={discover} alt="discover icon" className="mr-2" />
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
                <img src={albums} alt="albums icon" className="mr-2" />
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
                <img src={artist} alt="artist icon" className="mr-2" />
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
            
            <h1 className="text-melody-pink-500 mb-4 mt-4">Library</h1>
            <Link to="/recently">
              <div className="p-2 flex">
                <img src={recent} alt="recent icon" className="mr-2" />
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
                <img src={liked} alt="liked icon" className="mr-2" />
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
            </Link>            <h1 className="text-melody-pink-500 mb-4 mt-2">Account</h1>
            {Users ? (
              <>
                <Link to="/profile">
                  <div className="p-2 flex">
                    <img src={login} alt="profile icon" className="mr-2" />
                    <h1
                      className={`${
                        selected === "/profile" ? selectedStyle : "hover:text-red"
                      } text-2xl`}
                      onClick={() => {
                        localStorage.setItem("selected", "/profile");
                        setSelected("/profile");
                      }}
                    >
                      Profile
                    </h1>
                  </div>
                </Link>
                <div className="p-2 flex" onClick={handleSignout}>
                  <img src={logout} alt="logout icon" className="mr-2" />
                  <h1 className="text-2xl hover:text-red">Logout</h1>
                </div>
              </>
            ) : (
              <Link to="/login">
                <div className="p-2 flex">
                  <img src={login} alt="login icon" className="mr-2" />
                  <h1
                    className={`${
                      selected === "/login" ? selectedStyle : "hover:text-red"
                    } text-2xl`}
                    onClick={() => {
                      localStorage.setItem("selected", "/login");
                      setSelected("/login");
                    }}
                  >
                    Login
                  </h1>
                </div>
              </Link>
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
                <img src={home} alt="home icon" className="p-2" />
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
                <img src={discover} alt="discover icon" className="p-2" />
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
                <img src={albums} alt="albums icon" className="p-2 " />
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
                <img src={library} alt="library icon" className="p-2" />
                <h2
                  className={`${
                    selected === "/liked" ? selectedStyle : "hover:text-red"
                  } `}
                >
                  Library
                </h2>
              </div>
            </Link>            <Link to="/search">
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
                  Search
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
