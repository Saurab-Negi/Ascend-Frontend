import {
  FaStar,
  FaHeart,
  FaEye,
  FaClock,
  FaBalanceScale,
  FaHandshake,
  FaPrayingHands,
  FaRegCommentDots,
} from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import Features from "../../components/Feature/Features";
import Journey from "../../components/journey/Journey";
import { useEffect, useState } from "react";
import MusicModal from "../../components/Modal/MusicModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import Frame1 from "../../assets/icons/Group1.svg";
import Api from "../../services/Auth/Auth";
import Api2 from "../../services/StKey/StKey";
import type { UserInfo } from "../../types/user";
import useFetch from "../../hooks/useFetch";
import type { Key } from "../../types/key";
import type { SoundItem } from "../../types/recmmendation";
import { GoGoal } from "react-icons/go";
import { HiOutlineShieldCheck } from "react-icons/hi";
import "./Dashbaord.css";
import SoulPrintModal from "../../components/Ai Spiritual/AiSpiritual";
import AskToAi from "../../components/Modal/AskToAi";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [ModalId, setModalId] = useState(0);
  const [bg, setBg] = useState("bg-[#DF2A60]");
  const [time, setTime] = useState("");
  const [user, setUser] = useState<UserInfo>({} as UserInfo);
  const [keys2, setKeys2] = useState<Key[]>([]);

  const hour = new Date().getHours();
  const [searchParams] = useSearchParams();
  const users = searchParams.get("user");

  useEffect(() => {
    if (hour >= 5 && hour < 12) {
      setTime("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setTime("Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setTime("Good Evening");
    } else {
      setTime("Good Night");
    }
  }, [time]);

  const { data } = useFetch("user", Api.GetUser());
  const { data: key } = useFetch<{ data: Key[] }>("key", Api2.GetKeys());
  const { data: recommendedRitual } = useFetch<{ data: SoundItem[] }>(
    "recommendedRitual",
    Api.UserRecommendation()
  );
  // const { data: SmartRecommendations, error: SmartRecommendationsErrorData } =
  //   useFetch("SmartRecommendations", Api3.GetSmartRecommendations());

  useEffect(() => {
    if (data) {
      setUser(data.data.userInfo);
    }
    if (key) {
      setKeys2(key?.data);
    }
  }, [data, key]);
  useEffect(()=>{
    if(users==="true"){
      setIsOpen(true);
      setModalId(2);
    }
  },[users])

  const closeModal = () => setIsOpen(false);

  const Navigate = useNavigate();

  const soulprintLevel =
    user.level === "Beginner"
      ? 3
      : user.level === "Intermediate"
      ? 6
      : user.level === "Expert"
      ? 9
      : 0;
  const keys = [
    {
      title: "Belief",
      icon: <FaPrayingHands className="text-[#004236]" />,
      bg: "#004236",
    },
    {
      title: "Gratitude",
      icon: <FaHeart className="text-[#004236]" />,
      bg: "#8EA690 ",
    },
    {
      title: "Perspective",
      icon: <FaEye className="text-[#004236]" />,
      bg: "#8EA690",
    },
    {
      title: "Compassion",
      icon: <FaHandshake className="text-[#004236]" />,
      bg: "#004236",
    },
    {
      title: "Resilience",
      icon: <HiOutlineShieldCheck className="text-[#004236]" />,
      bg: "#8EA690",
    },
    {
      title: "Time",
      icon: <FaClock className="text-[#004236]" />,
      bg: "#8EA690",
    },
    {
      title: "Purpose",
      icon: <GoGoal className="text-[#004236]" />,
      bg: "#004236",
    },
    {
      title: "Balance",
      icon: <FaBalanceScale className="text-[#004236]" />,
      bg: "#004236",
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-r  from-[#8EA690] to-[#004236] ">
        <div className=" rounded-lg px-[1rem] py-[4rem] flex gap-3 flex-col-reverse md:flex-row items-center justify-between text-white shadow-md">
          {/* Left Content */}
          <div className="flex justify-center items-center md:mt-0 mt-6 flex-1">
            <div className="flex gap-2 flex-col items-start text-left">
              <h2 className="text-[1.6rem] sm:text-[2.5rem] font-poppins font-semibold">
                {" "}
                {time}, {user.firstName}
              </h2>
              <p className="text-[1.1rem] sm:text-[1.3rem] font-medium mb-4">
                Today is a perfect day for inner growth
              </p>

              {recommendedRitual?.data[0]?.stKeyName && (
                <p className="font-semibold font-poppins text-[1.1rem] sm:text-[1.4rem] my-4">
                  Your SoulPrint™ Today is{" "}
                  {recommendedRitual?.data[0]?.stKeyName}
                </p>
              )}
              <div>
                {user.level && (
                  <div className="flex items-center gap-1 bg-white rounded-lg pr-2">
                    <span className="bg-[#004236] text-white px-2 py-2 lg:py-2 lg:px-4 rounded-lg font-semibold text-[1.25rem]">
                      {user.level}
                    </span>
                    <div className="flex gap-[2px] sm:gap-[4px] md:gap-[6px] lg:gap-[12px] bg-white px-1 py-2 sm:py-3.5">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 rounded-[2px] sm:rounded-[3px] md:rounded-[4px] ${
                            i < soulprintLevel
                              ? "bg-gradient-to-r  from-[#8EA690] to-[#CFD8D0]"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex items-start justify-center mt-6 md:mt-0">
            <img
              src={Frame1}
              alt="Meditation"
              className="w-[28rem] mt-6 md:mt-0"
            />
          </div>
        </div>
      </div>
      {/* container content  */}
      <div className="container p-10  mx-auto text-center">
        <h2 className="text-[2.13rem] font-bold mb-8 text-[#263238]">
          The 8 Keys to Spiritual Transformation
        </h2>

        {keys2 && (
          <div className="grid my-6  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {keys2.map((key, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg flex flex-col items-start text-left transform transition-transform duration-800 ease-in-out hover:scale-110"
              >
                <div className="flex flex-row justify-between w-full">
                  <h3 className="text-[1.2rem] text-[#263238] font-semibold mt-4 ms-4">
                    {key.name}
                  </h3>

                  <div className="relative w-20 h-20 self-end">
                    <div
                      className={`w-full h-full rounded-tr-xl rounded-br-xl  rounded-bl-xl`}
                      style={{
                        backgroundColor: keys.find((k) => k.title === key.name)
                          ?.bg,
                      }}
                    ></div>

                    <div
                      className="absolute top-6 -left-5 w-12 h-[3.2rem] flex items-center justify-center bg-no-repeat bg-center bg-contain"
                      style={{
                        backgroundImage: `url("/Rectangle.svg")`,
                      }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center text-[1.7rem]">
                        {/* {key.icon} */}
                        {keys.find((k) => k.title === key.name)?.icon}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[0.95rem] font-semibold mt-2 text-[#263238] mx-3 my-2">
                  The Foundation
                </p>
                <p className="text-sm text-[#263238] font-medium mt-1 mx-2 my-4">
                  {key.description}
                </p>
              </div>
            ))}
          </div>
        )}
        {/* Recommended Ritual */}
        <div className="bg-white border rounded-lg shadow p-5 my-8 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h2 className="text-[1.3rem] sm:text-[1.6rem] md:text-[1.8rem] lg:text-[2.1rem] font-semibold text-gray-800">
              Today's Recommended Sound
            </h2>
            <span className="text-sm font-semibold text-gray-700">3 Min</span>
          </div>

          {/* Card content */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Icon and Text */}
            <div className="flex items-start gap-4 w-full sm:w-auto">
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#004236] rounded-full flex items-center justify-center flex-shrink-0">
                  <FaStar className="text-white w-3 h-3 md:w-5 md:h-5" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-poppins  font-semibold text-start text-gray-900">
                  {recommendedRitual?.data[0]?.stKeyName} Mastery Meditation
                </h3>
                <p className="text-md font-regular text-start text-gray-500">
                  Shape your relationship with time and meaning
                </p>
              </div>
            </div>

            {/* Button */}
            <div className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded bg-[#004236]"
                onClick={() => {
                  setIsOpen(true);
                  setModalId(0);
                  setBg("#004236");
                }}
              >
                Start
              </button>
            </div>
          </div>
        </div>

        {/* freature section */}
        <Features />

        {/* Journey */}
        <div className="flex flex-wrap gap-4 w-full">
          <Journey
            bgColor="#2D7467"
            icon={<FaStar />}
            title="8 Keys Assessment"
            description="Discover your spiritual strengths & growth areas"
            onclick={() => {
              Navigate("/assessments");
            }}
          />
          <Journey
            bgColor="#004236"
            icon={<FaWandMagicSparkles />}
            title="AI Spiritual Insights"
            description="Deep analysis & personalized guidance"
            onclick={() => {
              setModalId(1);
              setIsOpen(true);
              setBg("#882ADF");
            }}
          />
        </div>
      </div>

      {/* chatbaote area  */}
      <div
        style={{
          backgroundColor: "transparent",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url("/Bot.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100px",
          height: "100px",
        }}
        onClick={() => {
          setModalId(2);
          setIsOpen(true);
        }}
        className="fixed bottom-6 right-6  text-white p-1   cursor-pointer transition shake"
      >
        <div className="absolute -top-1 -right-1 bg-[#2D7467] text-xs text-white font-bold px-1.5 py-1.5 rounded-full shadow">
          <FaRegCommentDots size={12} />
        </div>
      </div>

      {/* popup modal */}
      {ModalId === 0 && (
        <MusicModal
          isOpen={isOpen}
          setIsOpen={closeModal}
          bg={bg}
          url={
            recommendedRitual?.data[0]?.sound[
              Math.floor(
                Math.random() * recommendedRitual?.data[0]?.sound.length
              )
            ]
          }
          Tittle={`${recommendedRitual?.data[0]?.stKeyName} Mastery Meditation`}
          speak={recommendedRitual?.data[0]?.desc}
        />
      )}
      {ModalId === 1 && (
        <SoulPrintModal isOpen={isOpen} setIsOpen={closeModal} />
      )}
      {ModalId === 2 && (
        <AskToAi
          GuideType ={"Tour"}
          AiType={ModalId}
          isOpen={isOpen}
          setIsOpen={closeModal}
        />
      )}
    </>
  );
}

export default Dashboard;
