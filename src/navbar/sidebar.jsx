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
import login from "../assets/user.svg";
import offline from "../assets/offline_icon_blue_outline.svg";
import { logoutUser } from "../Firebase/auth";
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
        <aside className="w-64 bg-deep-blue h-screen overflow-y-auto hidden lg:block">
          <h1 className="bg-gradient-rainbow text-transparent bg-clip-text text-2xl p-6 font-bold">
            MelodyMind
          </h1>
          <div className="px-6 space-y-4">
            <h2 className="text-melody-pink-500">Menu</h2>
            {[
              { path: "/", label: "Home", icon: home },
              { path: "/discover", label: "Discover", icon: discover },
              { path: "/albums", label: "Albums", icon: albums },
              { path: "/artist", label: "Artist", icon: artist },
            ].map(({ path, label, icon }) => (
              <Link to={path} key={path}>
                <div className="flex items-center gap-2 p-2 hover:cursor-pointer">
                  <img src={icon} alt={`${label} icon`} className="h-6 w-6" />
                  <h1
                    className={`text-lg ${
                      selected === path ? selectedStyle : "hover:text-red"
                    }`}
                    onClick={() => {
                      localStorage.setItem("selected", path);
                      setSelected(path);
                    }}
                  >
                    {label}
                  </h1>
                </div>
              </Link>
            ))}

            <h2 className="text-melody-pink-500 mt-6">Library</h2>
            {[
              { path: "/recently", label: "Recently", icon: recent },
              { path: "/liked", label: "Liked", icon: liked },
              { path: "/offline", label: "Offline", icon: offline },
            ].map(({ path, label, icon }) => (
              <Link to={path} key={path}>
                <div className="flex items-center gap-2 p-2 hover:cursor-pointer">
                  <img src={icon} alt={`${label} icon`} className="h-6 w-6" />
                  <h1
                    className={`text-lg ${
                      selected === path ? selectedStyle : "hover:text-red"
                    }`}
                    onClick={() => {
                      localStorage.setItem("selected", path);
                      setSelected(path);
                    }}
                  >
                    {label}
                  </h1>
                </div>
              </Link>
            ))}

            <h2 className="text-melody-pink-500 mt-6">Account</h2>
            {Users ? (
              <>
                <Link to="/profile">
                  <div className="flex items-center gap-2 p-2 hover:cursor-pointer">
                    <img src={login} alt="profile icon" className="h-6 w-6" />
                    <h1
                      className={`text-lg ${
                        selected === "/profile" ? selectedStyle : "hover:text-red"
                      }`}
                      onClick={() => {
                        localStorage.setItem("selected", "/profile");
                        setSelected("/profile");
                      }}
                    >
                      Profile
                    </h1>
                  </div>
                </Link>
                <div className="flex items-center gap-2 p-2 hover:cursor-pointer" onClick={handleSignout}>
                  <img src={logout} alt="logout icon" className="h-6 w-6" />
                  <h1 className="text-lg hover:text-red">Logout</h1>
                </div>
              </>
            ) : (
              <Link to="/login">
                <div className="flex items-center gap-2 p-2 hover:cursor-pointer">
                  <img src={login} alt="login icon" className="h-6 w-6" />
                  <h1
                    className={`text-lg ${
                      selected === "/login" ? selectedStyle : "hover:text-red"
                    }`}
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
          <nav className="flex justify-around items-center h-full px-4">
            {[
              { path: "/", label: "Home", icon: home },
              { path: "/discover", label: "Discover", icon: discover },
              { path: "/albums", label: "Albums", icon: albums },
              { path: "/liked", label: "Library", icon: library },
              { path: "/search", label: "Search", icon: search },
            ].map(({ path, label, icon }) => (
              <Link to={path} key={path}>
                <div
                  className="flex flex-col items-center"
                  onClick={() => {
                    localStorage.setItem("selected", path);
                    setSelected(path);
                  }}
                >
                  <img src={icon} alt={`${label} icon`} className="h-6 w-6 mb-1" />
                  <h2
                    className={`text-xs ${
                      selected === path ? selectedStyle : "hover:text-red"
                    }`}
                  >
                    {label}
                  </h2>
                </div>
              </Link>
            ))}
          </nav>
        </footer>
      )}
    </>
  );
}

export default Sidebar;