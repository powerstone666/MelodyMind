import AudioPlayerr from "./AudioPlayer/audioplayer";
import Home from "./Home/home";
import Navbar from "./navbar/navbar";
import useMediaQuery from "./useMedia";

function Landing({selected,setSelected}){
    const isAboveMedium = useMediaQuery('(min-width: 768px)');
    const rendercomponents=()=>{
        switch(selected){
            case "home":
                return <Home/>
            case "discover":
                return <h1>Discover</h1>
            case "albums":
                return <h1>Albums</h1>
            case "artist":
                return <h1>Artist</h1>
            case "recently":
                return <h1>Recently</h1>
            case "liked":
                return <h1>Liked</h1>
            case "search":
                return <h1>Search</h1>
            case "about":
                return <h1>About</h1>
            case "contact":
                return <h1>Contact</h1>
            case "mood":
                return <h1>Mood Analyser</h1>
            case "login":
                return <h1>Login</h1>
            case "signup":
                return <h1>Sign Up</h1>
            default:
                return <h1>Home</h1>
        }
    
    }
return (
    <div className="w-full h-screen">
        <Navbar selected={selected} setSelected={setSelected}/>
        {rendercomponents()}
        {isAboveMedium ?(
        <div className="fixed bottom-0 w-full">
        <AudioPlayerr/>
        </div>
        ):(
            <div className="fixed bottom-20 w-full">
        <AudioPlayerr/>
        </div>
        )
}

    </div>
)
}
export default Landing;