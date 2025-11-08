import {
  FaHeart,
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useRef, useState, useEffect } from "react";

function MusicModal({
  isOpen,
  setIsOpen,
  bg,
  Tittle,
  speak,
  url,
}: {
  isOpen?: boolean;
  setIsOpen: Function;
  bg: string;
  Tittle?: string;
  speak?: string;
  url?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!audioRef.current) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audioRef.current.currentTime = percentage * duration;
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  function handleEnded() {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }

  function clearStates() {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-80 rounded-lg shadow-lg overflow-visible bg-white">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-white rounded-full p-2 shadow-md flex items-center justify-center">
                <FaHeart className="text-xl" style={{ color: bg }} />
              </div>
            </div>

            <div
              className="rounded-t-lg text-white text-center p-4"
              style={{ backgroundColor: bg }}
            >
              <IoMdClose
                className="absolute top-1 text-white text-2xl right-1 cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  clearStates();
                }}
              />
              <div className="font-bold">{Tittle}</div>
              <div className="text-sm">Guided meditation</div>
            </div>

            <div className="p-4 text-center">
              <div className="font-semibold mb-2">
                Focus on your breath and repeat:
              </div>
              <div className="text-2xl font-bold mb-6">"{speak}"</div>
              <div className="flex justify-center mb-4">
                <div
                  className="w-14 h-14 rounded-full shadow-md flex items-center justify-center animate-breathing"
                  style={{
                    backgroundColor: bg,
                    boxShadow: `0 0 24px 6px ${bg}`,
                  }}
                />
              </div>
              <div className="text-sm text-gray-500">Press play to begin</div>
            </div>

            <div className="px-6 pb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div
                className="w-full h-2 bg-[#D4CDC3] rounded-full mb-4 cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-[#004236] rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-6 text-[#004236] text-xl">
                <FaBackward
                  className="cursor-pointer"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime -= 5;
                  }}
                />
                <div
                  className="w-10 h-10 bg-[#004236] pl-1 text-white rounded-full flex items-center justify-center cursor-pointer"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <FaPause className="cursor-pointer mr-1" />
                  ) : (
                    <FaPlay className="cursor-pointer" />
                  )}
                </div>
                <FaForward
                  className="cursor-pointer"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime += 5;
                  }}
                />
              </div>
            </div>

            {url && (
              <audio
                ref={audioRef}
                src={url}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MusicModal;
