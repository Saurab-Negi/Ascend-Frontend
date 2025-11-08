import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import {
  FaHeart,
  FaRegEye,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaClock,
  FaBullseye,
  FaBalanceScale,
  FaPrayingHands,
} from "react-icons/fa";
import Api from "../../services/Auth/Auth";
import Api2 from "../../services/StKey/StKey";
import useFetch from "../../hooks/useFetch";
import type { Key } from "../../types/key";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const balanceData = [
  {
    icon: <FaPrayingHands />,
    label: "Belief",
    color: "from-[#004236] to-[#8EA690]",
    value: 60,
  },
  {
    icon: <FaHeart />,
    label: "Gratitude",
    color: "from-[#004236] to-[#8EA690]",
    value: 55,
  },
  {
    icon: <FaRegEye />,
    label: "Perspective",
    color: "from-[#004236] to-[#8EA690]",
    value: 40,
  },
  {
    icon: <FaHandHoldingHeart />,
    label: "Compassion",
    color: "from-[#004236] to-[#8EA690]",
    value: 80,
  },
  {
    icon: <FaShieldAlt />,
    label: "Resilience",
    color: "from-[#004236] to-[#8EA690]",
    value: 60,
  },
  {
    icon: <FaClock />,
    label: "Time",
    color: "from-[#004236] to-[#8EA690]",
    value: 20,
  },
  {
    icon: <FaBullseye />,
    label: "Purpose",
    color: "from-[#004236] to-[#8EA690]",
    value: 45,
  },
  {
    icon: <FaBalanceScale />,
    label: "Balance",
    color: "from-[#004236] to-[#8EA690]",
    value: 90,
  },
];

function SoulPrint() {
  const { data, isLoading, error } = useFetch("user", Api.GetUser());
  const {
    data: keys,
    isLoading: keyLoding,
    error: keyError,
  } = useFetch<{ data: Key[] }>("key", Api2.GetKeys());
  const filled =
    2 * Math.PI * 60 -
    (data?.data?.soulScore?.[0]?.totalScore / 100) * (2 * Math.PI * 60);

  const navigate = useNavigate();

  const radarData = {
    labels: keys?.data?.map((key: Key) => key.name),
    datasets: [
      {
        label: "Spiritual Rhythm",
        data: keys?.data?.map(
          (key: Key) => data?.data?.soulScore[0]?.[key.name.toLocaleLowerCase()]
        ),
        backgroundColor: "rgba(102, 92, 246, 0.3)",
        borderColor: "#7ca7f8ff",
        borderWidth: 2,
        pointBackgroundColor: "#7ca7f8ff",
      },
    ],
  };
  return (
    <div className="pt-4 md:pt-5 bg-white min-h-[calc(100vh-7.5rem)]">
      <div className="bg-[#004236] flex gap-2 align-center text-white text-xl sm:text-3xl font-semibold py-5 px-[1rem] md:px-[3rem] lg:px-[6rem]  shadow-md">
        SoulPrint™ Dashboard
      </div>
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-50 rounded-md p-6 flex flex-col items-center justify-center md:col-span-1">
            <p className="text-lg font-medium mb-4">Overall Score</p>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#004236]"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : error ? (
              <p className="text-lg font-medium mb-4">
                Error Something went wrong
              </p>
            ) : (
              <div className="relative w-32 h-32">
                <svg className="w-full h-full">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="60"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="60"
                    stroke="#004236"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={filled}
                    strokeLinecap="round"
                    transform="rotate(-90 64 64)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-2xl font-bold text-gray-800">
                    {data?.data?.soulScore[0]?.totalScore}
                  </p>
                  <p className="text-sm text-gray-500">Wellness Score</p>
                </div>
              </div>
            )}
          </div>

          {/* Radar Chart - occupies 2 columns on md+ */}
          <div className="bg-purple-50 rounded-md p-6 md:col-span-2">
            <p className="text-lg font-medium mb-2">Radar Chart</p>
            {keyLoding ? (
              <div className="flex items-center justify-center h-40">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : keyError ? (
              <p className="text-lg font-medium mb-4 text-red-500">
                Something went wrong
              </p>
            ) : (
              <div className="h-60">
                <Radar
                  data={radarData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            )}
            <p className="text-base text-right mt-2  font-semibold">
              Spiritual Rhythm <br />
              <span className="text-sm text-[#004236] font-semibold">
                {data?.data?.soulScore[0]?.spiritualType}
              </span>
            </p>
          </div>
        </div>

        {keyLoding ? (
          <div className="flex items-center justify-center h-40">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : keyError ? (
          <p className="text-lg font-medium mb-4 text-red-500">
            Something went wrong
          </p>
        ) : (
          <div className="mb-6 max-w-4xl">
            <p className="text-lg font-semibold mb-6">8 Keys Balance</p>
            <div className="space-y-6">
              {keys?.data.map((item, idx) => {
                const score =
                  data?.data?.soulScore[0]?.[item.name.toLowerCase()] ?? 0;
                const gradient = balanceData[idx % balanceData.length].color;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-8"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="w-10 h-10"
                        />
                      </div>
                      <span className="text-[16px] font-semibold sm:font-bold text-[#263238]">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center w-full gap-4">
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${gradient}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#263238] w-[40px] text-right">
                        {score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Button */}
        <button
          className="bg-[#004236] text-white px-6 my-4 py-2 rounded-md text-sm font-medium hover:bg-[#004236] transition"
          onClick={() => navigate("/assessments")}
        >
          Retake Assessment
        </button>
      </div>
    </div>
  );
}

export default SoulPrint;
