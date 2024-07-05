import img from "../src/assets/music icon2.png";
import useMediaQuery from "./useMedia";
import bgimage from "../src/assets/7tqQ0e.jpg";
const mystyle = {
    bg1: {
      backgroundImage: `url(${bgimage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      objectFit: "cover",
      height: "100vh",
    },
  };
export default function AboutUs() {
    const isAboveMedium = useMediaQuery("(min-width: 768px)");
  return (
    <>
    {isAboveMedium ? (
    <div className="bg-slate text-white p-8 h-screen" style={{...mystyle.bg1,overflowY:"scroll"} } >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="mb-4 text-2xl">
          Welcome to MelodyMinds, where every beat matters. At MelodyMinds, we
          believe music is more than just sound – it’s an experience, a journey,
          and a way to connect with the world. We’re passionate about bringing
          the joy of music to your fingertips, making every note count and every
          playlist unforgettable.
        </p>

        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="mb-4 ">
          Our mission is to empower music lovers by providing a platform that
          delivers exceptional sound quality, innovative features, and an
          unparalleled user experience. We strive to be the go-to app for all
          your music needs, making it easy for you to explore, enjoy, and share
          your favorite songs.
        </p>
        <div className="flex items-center mb-4">
          <img
            src={img}
            alt="not found"
            class="border border-black  w-[3rem] h-[3rem] bg-purple-600 rounded-xl  mr-2 "
          />

          <p>
            Our Music App is your ultimate destination for discovering and
            enjoying music!
          </p>
        </div>
        <h2 className="text-2xl font-bold">Join Communtiy</h2>
        <p>
          We’re more than just an app – we’re a community of music enthusiasts
          who share a common passion. Connect with us on social media, share
          your playlists, and join the conversation. We’re excited to have you
          on this musical journey with us.
        </p>
        <div className="flex mt-4 items-center justify-center gap-7">
          <a href="#" className="mr-4">
            <i class="fa-brands fa-facebook text-3xl "></i>
          </a>
          <a href="#">
            <i class="fa-brands fa-instagram text-3xl"></i>
          </a>
          <a>
            <i class="fa-brands fa-linkedin text-3xl"></i>
          </a>
        </div>
      </div>
    </div>
    ):(
        <div className="bg-slate text-white p-8 h-screen" style={{...mystyle.bg1,overflowY:"scroll"} }>
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">About Us</h2>
        <p className="mb-4 text-sm">
          Welcome to MelodyMinds, where every beat matters. At MelodyMinds, we
          believe music is more than just sound – it’s an experience, a journey,
          and a way to connect with the world. We’re passionate about bringing
          the joy of music to your fingertips, making every note count and every
          playlist unforgettable.
        </p>

        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="mb-4 text-sm" >
          Our mission is to empower music lovers by providing a platform that
          delivers exceptional sound quality, innovative features, and an
          unparalleled user experience. We strive to be the go-to app for all
          your music needs, making it easy for you to explore, enjoy, and share
          your favorite songs.
        </p>
        <div className="flex items-center mb-4 text-sm">
          <img
            src={img}
            alt="not found"
            class="border border-black  w-[3rem] h-[3rem] bg-purple-600 rounded-xl  mr-2 "
          />

          <p>
            Our Music App is your ultimate destination for discovering and
            enjoying music!
          </p>
        </div>
        <h2 className="text-2xl font-bold ">Join Communtiy</h2>
        <p className="text-sm">
          We’re more than just an app – we’re a community of music enthusiasts
          who share a common passion. Connect with us on social media, share
          your playlists, and join the conversation. We’re excited to have you
          on this musical journey with us.
        </p>
        <div className="flex mt-4 items-center justify-center gap-7">
          <a href="#" className="mr-4">
            <i class="fa-brands fa-facebook text-3xl "></i>
          </a>
          <a href="#">
            <i class="fa-brands fa-instagram text-3xl"></i>
          </a>
          <a>
            <i class="fa-brands fa-linkedin text-3xl"></i>
          </a>
        </div>
      </div>
      <section className='h-56'>

</section>
    </div>
    
    )
}
</>
  );
}