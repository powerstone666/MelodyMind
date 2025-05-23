import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Context } from "./context.js"; // Import Context from separate file
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";

const Appwrapper = () => {
  const[selected, setSelected] = useState(localStorage.getItem("selected")||"home");
  const [songid, setSongid] = useState(localStorage.getItem("songid") || "");
  const [Viewall,setViewall]=useState(3)
  const [page,setPage]=useState("")
  const [search, setSearch] = useState("");
  const [singer, setSinger] = useState(localStorage.getItem("singer") || "");
  const [innerAlbum, setInneralbum] = useState(localStorage.getItem("innerAlbum") || "");
  const [languages, setLanguage] = useState(localStorage.getItem("languages")|| "hindi" );
  const [lyrics,setLyrics]=useState(localStorage.getItem("lyrics")||"No Lyrics Found");
  const [spotify,setSpotify]=useState(localStorage.getItem("spotify")||"");
  const [spotifyArtist,setSpotifyArtist]=useState(localStorage.getItem("spotifyArtist")||"");
  const [Users,setUsers]=useState(localStorage.getItem("Users") ? JSON.parse(localStorage.getItem("Users")) : "");
  const [songHistory, setSongHistory] = useState(JSON.parse(localStorage.getItem("songHistory") || "[]"));
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(parseInt(localStorage.getItem("currentHistoryIndex") || "0"));
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  
  // Save song history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("songHistory", JSON.stringify(songHistory));
  }, [songHistory]);
  
  // Save current history index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentHistoryIndex", currentHistoryIndex.toString());
  }, [currentHistoryIndex]);
    return (
    <Context.Provider value={{ 
      songid, setSongid, 
      search, setSearch,
      languages, setLanguage,
      innerAlbum, setInneralbum,
      selected, setSelected,
      Viewall, setViewall,
      page, setPage,
      singer, setSinger,
      lyrics, setLyrics,
      spotify, setSpotify,
      spotifyArtist, setSpotifyArtist,
      Users, setUsers,
      songHistory, setSongHistory,
      currentHistoryIndex, setCurrentHistoryIndex,
      recommendations, setRecommendations,
      isLoadingRecommendations, setIsLoadingRecommendations
    }}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Appwrapper />
  </React.StrictMode>
);
