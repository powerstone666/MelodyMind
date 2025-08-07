import AudioPlayerr from "./AudioPlayer/audioplayer";

import Navbar from "./navbar/navbar";
import useMediaQuery from "./useMedia";
import {useContext} from "react";
import {Context} from "./context.js";
import AppRoutes from "./components/AppRoutes";
import AudioPlayerComponent from "./AudioPlayer/audioplayer";

function Landing() {
  const { selected, setSelected } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 768px)");

  return (
    <div className="w-full min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-grow overflow-y-auto pb-24"> {/* Prevent overlap with audio player */}
        <AppRoutes />
      </div>
      {isAboveMedium ? (
        <div className="fixed bottom-0 w-full">
          <AudioPlayerComponent />
        </div>
      ) : (
        <div className="fixed  w-full z-40">
          <AudioPlayerComponent />
        </div>
      )}
    </div>
  );
}

export default Landing;
