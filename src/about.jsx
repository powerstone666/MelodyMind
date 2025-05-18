import img from "../src/assets/music icon2.png";
import useMediaQuery from "./useMedia";

export default function AboutUs() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  return (
    <div className="bg-gradient-to-br from-[#181824] via-[#23263a] to-[#2d2e3e] text-white min-h-screen flex flex-col">
      <div className={`flex-1 w-full ${isAboveMedium ? "p-8" : "p-4"} pb-40 overflow-y-auto`}>
        <div className={`mx-auto ${isAboveMedium ? "max-w-2xl p-8" : "max-w-xl p-4"} bg-black/70 rounded-2xl shadow-lg mt-8 mb-8`}>
          <h2 className={`font-bold mb-4 ${isAboveMedium ? "text-3xl" : "text-2xl"}`}>About Us</h2>
          <p className={`mb-4 ${isAboveMedium ? "text-2xl" : "text-base"}`}>
            Welcome to <span className="text-melody-pink-400 font-semibold">MelodyMinds</span>, where every beat matters. At MelodyMinds, we
            believe music is more than just sound – it’s an experience, a journey,
            and a way to connect with the world. We’re passionate about bringing
            the joy of music to your fingertips, making every note count and every
            playlist unforgettable.
          </p>

          <h2 className={`font-bold mb-4 ${isAboveMedium ? "text-3xl" : "text-2xl"}`}>Our Mission</h2>
          <p className={`mb-4 ${isAboveMedium ? "" : "text-base"}`}>
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
              className="border border-black w-12 h-12 bg-purple-600 rounded-xl mr-3"
            />
            <p className={`${isAboveMedium ? "" : "text-sm"}`}>
              Our Music App is your ultimate destination for discovering and
              enjoying music!
            </p>
          </div>
          <h2 className={`font-bold ${isAboveMedium ? "text-2xl" : "text-xl"}`}>Join Community</h2>
          <p className={`${isAboveMedium ? "" : "text-sm"}`}>
            We’re more than just an app – we’re a community of music enthusiasts
            who share a common passion. Connect with us on social media, share
            your playlists, and join the conversation. We’re excited to have you
            on this musical journey with us.
          </p>
          <div className="flex mt-4 items-center justify-center gap-7">
            <a href="#" className="mr-4">
              <i className="fa-brands fa-facebook text-3xl"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-instagram text-3xl"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin text-3xl"></i>
            </a>
          </div>
        </div>

        {/* Disclaimer Section */}
      <div className={`mx-auto ${isAboveMedium ? "max-w-2xl" : "max-w-xl"} mb-10`}>
  <div className="bg-red-900/90 border-2 border-red-400 rounded-2xl p-6 shadow-xl text-white text-center">
    <h3 className="text-2xl font-bold mb-2 text-red-200">Disclaimer & Terms</h3>
    <p className="mb-2 font-semibold text-lg text-red-100">
      <span className="uppercase">For Educational & Demonstration Purposes Only</span>
    </p>
    <p className="mb-2 text-base">
      <span className="font-bold text-red-300">MelodyMinds</span> is a non-commercial side project created to demonstrate software engineering skills. It is not affiliated with, endorsed by, or intended to replicate the services of any official streaming provider.
    </p>
    <p className="mb-2 text-base">
      All audio-related features are intended to simulate functionality using publicly available metadata, mock content, or API-based previews where permitted. This app does <span className="font-bold">not host, stream, or distribute any copyrighted music</span>.
    </p>
    <p className="mb-2 text-base">
      By using this application, you acknowledge and agree to the following:
      <ul className="list-disc list-inside text-left mt-2 text-sm text-red-100">
        <li>This project is for personal learning and educational exploration only.</li>
        <li>No copyrighted material is intentionally included or distributed.</li>
        <li>All rights to any referenced music, branding, or media belong to their respective copyright holders.</li>
        <li>This app is not a licensed music streaming platform, and no commercial benefit is derived from its use.</li>
        <li>If any content or functionality is found to be in violation of intellectual property rights, please notify us and we will take prompt corrective action.</li>
        <li>Use at your own risk. This is a prototype and comes with no warranties or guarantees.</li>
      </ul>
    </p>
    <p className="mt-4 text-base text-red-200 font-semibold">
      This app is a demonstration of frontend/backend integration and UI/UX design, not a media distribution tool.
    </p>
  </div>
</div>
</div>
      {/* Spacer for bottom audio player */}
      <div className="h-28 w-full flex-shrink-0"></div>
    </div>
  );
}