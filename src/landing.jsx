import AlbumFull from "./Albumsongs/albumfull";
import AudioPlayerr from "./AudioPlayer/audioplayer";
import Discover from "./Discover/discover";
import Home from "./Home/home";
import Searchfunc from "./Search/search";
import Navbar from "./navbar/navbar";
import useMediaQuery from "./useMedia";
import ArtistPage from "./Playlist/artistpage";
import Inneralbum from "./Albumsongs/inneralbum";
import { useContext } from "react";
import { Context } from "./main";
import Innerartist from "./Playlist/innerartist";
import Innersongs from "./AudioPlayer/innersongs";
import Moodanalyse from "./moodanalyse";
function Landing() {
  const {selected,setSelected}=useContext(Context)
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const rendercomponents = () => {
    switch (selected) {
      case "home":
        return <Home />;
        case "innersong":
          return <Innersongs />;
      case "discover":
        return <Discover />;
      case "albums":
        return <AlbumFull />;
      case "innerAlbum":
      return <Inneralbum />;
      case "artist":
        return <ArtistPage/>;
        case "innerartist":
          return <Innerartist/>;
      case "recently":
        return <h1>Recently</h1>;
      case "liked":
        return <h1>Liked</h1>;
      case "search":
        return <Searchfunc />;
      case "about":
        return <h1>About</h1>;
      case "contact":
        return <h1>Contact</h1>;
      case "mood":
        return <Moodanalyse/>;
      case "login":
        return <h1>Login</h1>;
      case "signup":
        return <h1>Sign Up</h1>;
      default:
        return <h1>Home</h1>;
    }
  };
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar selected={selected} setSelected={setSelected} />
      {rendercomponents()}
      {isAboveMedium ? (
        <div className="fixed bottom-0 w-full">
          <AudioPlayerr />
        </div>
      ) : (
        <div className="fixed  w-full z-40">
          <AudioPlayerr />
        </div>
      )}
    </div>
  );
}
export default Landing;
