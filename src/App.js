import { useState } from "react";
import { Game } from "./components/Game";
import mainTheme from "./assets/audio/mainTheme.mp3";
import mainImg from "./assets/images/main_img.png";
import VolumeOffIcon from "@mui/icons-material/VolumeOff"; // Імпорт іконки
import VolumeDownIcon from "@mui/icons-material/VolumeDown"; // Імпорт іконки

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  const startGame = (startOrEnd) => {
    if (startOrEnd === "start") {
      setIsGameStarted(true);
    } else if (startOrEnd === "end") {
      setIsGameStarted(false);
    }
  };

  const toggleMusic = () => {
    setIsMusicMuted(!isMusicMuted);
    const audio = document.getElementById("mainTheme");
    if (audio) {
      if (isMusicMuted) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-800'>
      {isGameStarted ? (
        <>
          <button
            className='absolute top-4 right-4 px-4 py-2 bg-gray-900 text-white border border-white rounded-md shadow-md hover:bg-gray-700'
            onClick={() => {
              startGame("end");
            }}
          >
            End Game
          </button>
          <Game />
        </>
      ) : (
        <div
          className='relative flex flex-col items-center justify-center flex-1 w-full h-screen overflow-hidden'
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${mainImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button
            className='px-8 py-4 text-xl font-bold text-white bg-transparent border-4 border-white rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110 hover:bg-white hover:text-gray-800'
            onClick={() => {
              startGame("start");
            }}
          >
            Start Game
          </button>
        </div>
      )}
      <div className='fixed bottom-4 right-4'>
        <button
          className='px-4 py-2 bg-transparent border border-white text-white rounded-md shadow-md backdrop-blur-md hover:bg-white hover:bg-opacity-20 transition duration-300 ease-in-out'
          onClick={toggleMusic}
        >
          {isMusicMuted ? <VolumeOffIcon /> : <VolumeDownIcon />}
        </button>
      </div>
      <audio
        id='mainTheme'
        src={mainTheme}
        autoPlay
        loop
      ></audio>
    </div>
  );
}

export default App;
