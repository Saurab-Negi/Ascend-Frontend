import { useEffect, useState } from "react";
import type { KeySoundData } from "../../types/temple";
import Api2 from "../../services/Temples/Temple";
import Api from "../../services/StKey/StKey";
import useFetch from "../../hooks/useFetch";
import {  FaChevronLeft, FaMusic } from "react-icons/fa";
import type { Key } from "../../types/key";

function Temples() {
  const [AllTemplates, setAllTemplates] = useState<KeySoundData[]>([]);
  const [templeType, setTempleType] = useState(0);
  const [keys2, setKeys2] = useState<Key[]>([]);
  const [ui, setUI] = useState(1);
  const [track, setTrack] = useState<string[]>([]);

  const { data } = useFetch<{ data: Key[] }>("key", Api.GetKeys());
  const {
    data: templates,
    isLoading,
    error,
  } = useFetch<{ data: KeySoundData[] }>("sound", Api2.GetSound());

  useEffect(() => {
    if (data) setKeys2(data.data);
  }, [data]);
  useEffect(() => {
    if (!templates?.data) return;

    const categoryMap = [
      "Grounding Soundscape",
      "Gratitude Tones",
      "Stillness Meditation",
    ];
    setAllTemplates(
      templates.data.filter(
        (temple) => temple.category === categoryMap[templeType]
      )
    );
  }, [templeType, templates]);

  const nextDarkerMap: Record<string, string> = {
    "bg-indigo-100": "bg-indigo-300",
    "bg-indigo-300": "bg-indigo-500",
    "bg-indigo-500": "bg-indigo-700",

    "bg-green-100": "bg-green-300",
    "bg-green-300": "bg-green-500",
    "bg-green-500": "bg-green-700",

    "bg-lime-100": "bg-lime-300",
    "bg-lime-300": "bg-lime-500",
    "bg-lime-500": "bg-lime-700",

    "bg-yellow-100": "bg-yellow-300",
    "bg-yellow-300": "bg-yellow-500",
    "bg-yellow-500": "bg-yellow-700",

    "bg-orange-100": "bg-orange-300",
    "bg-orange-300": "bg-orange-500",
    "bg-orange-500": "bg-orange-700",

    "bg-pink-100": "bg-pink-300",
    "bg-pink-300": "bg-pink-500",
    "bg-pink-500": "bg-pink-700",
  };

  function getDarkerTailwindClass(baseColor: string): string {
    return nextDarkerMap[baseColor] || baseColor;
  }

  return (
    <div>
      {ui === 1 && (
        <div className="p-6 space-y-6 bg-gray-100 min-h-[calc(100vh-7.5rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">KeySound Temples™</h2>
            <p className="text-gray-600 text-sm">
              Bioteedback-driven adaptive audio for spiritual transformation
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              className={`${
                templeType === 0
                  ? "bg-[#004236] text-white"
                  : "bg-white text-gray-600 border border-gray-300"
              } px-3 py-1 rounded-md hover:bg-yellow-500 hover:text-white`}
              onClick={() => setTempleType(0)}
            >
              Grounding Soundscape 
            </button>

            <button
              className={`${
                templeType === 1
                  ? "bg-[#004236] text-white"
                  : "bg-white text-gray-600 border border-gray-300"
              } px-3 py-1 rounded-md hover:bg-yellow-500 hover:text-white`}
              onClick={() => setTempleType(1)}
            >
             Gratitude Tones 
            </button>

            <button
              className={`${
                templeType === 2
                  ? "bg-[#004236] text-white"
                  : "bg-white text-gray-600 border border-gray-300"
              } px-3 py-1 rounded-md hover:bg-yellow-500 hover:text-white`}
              onClick={() => setTempleType(2)}
            >
              Stillness Meditation 
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 animate-pulse border rounded shadow bg-white"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <p className="text-red-500">Something went wrong</p>
            ) : AllTemplates.length === 0 ? (
              <p className="text-gray-600">No temples found</p>
            ) : (
              AllTemplates.map((temple, idx) => {
                const icon = keys2.find(
                  (key) => key.id === temple.stKeyId
                )?.icon;
                return (
                  <Card key={idx} className={`p-3 ${temple.color}`}>
                    <CardContent>
                      <div className="flex gap-2 items-center cursor-pointer">
                        <img
                          src={icon}
                          alt="Temple Icon"
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-md mb-1">
                            {temple.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-1">
                            {temple.freq}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 my-3">
                        {temple.desc}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FaMusic size={14} /> {temple.sound.length} tracks
                        </p>
                        <button
                          className={`hover:underline text-sm px-3 py-1 rounded-md ${getDarkerTailwindClass(
                            temple.color
                          )}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setUI(2);
                            setTrack(temple.sound);
                          }}
                        >
                          Enter Temple
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}
      {ui === 2 && (
        <div className="p-6 space-y-6 bg-gray-100">
          <button
            onClick={() => {
              setUI(1);
            }}
            className="rounded-full bg-[#004236] pr-2 p-2 hover:bg-gray-500 transition"
          >
            <FaChevronLeft className="text-white text-lg" />
          </button>
          <h2 className="text-2xl font-bold">Soundscape Temples</h2>
          {track.map((temple, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-lg p-4 flex flex-col items-center text-center"
            >
              <p className="text-sm font-semibold mb-2">
                Temple Track {idx + 1}
              </p>
              <audio controls className="w-full mb-2">
                <source src={temple} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Temples;

const Card = ({
  children,
  className,
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`rounded-lg shadow-sm border  ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const CardContent = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div className={`'p-4 ${className}`} style={style}>
      {children}
    </div>
  );
};
