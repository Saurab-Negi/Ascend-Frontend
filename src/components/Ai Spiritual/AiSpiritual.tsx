import { useState } from "react";

import { BsStars } from "react-icons/bs";
import { FaArrowRight, FaEye, FaRegStar } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GiTargetPrize } from "react-icons/gi";
import Api from "../../services/SpiritualAi/AiSpiritual";
import { GoGoal, GoLightBulb } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import { RiFootballFill } from "react-icons/ri";
import useFetch from "../../hooks/useFetch";

function SoulPrintModal({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen: Function;
}) {
  if (!isOpen) return null;
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { icon: <FaEye />, label: "Deep Analysis" },
    { icon: <GoLightBulb />, label: "Personal Insight" },
    { icon: <GoGoal />, label: "Smart Practices" },
    { icon: <FaArrowTrendUp />, label: "Evolution Path" },
  ];

  const growthData = [
    { label: "Belief", color: "bg-[#004236]" },
    { label: "Perspective", color: "bg-blue-500" },
    { label: "Resilience", color: "bg-yellow-500" },
    { label: "Purpose", color: "bg-amber-800" },
    { label: "Gratitude", color: "bg-red-500" },
    { label: "Compassion", color: "bg-green-500" },
    { label: "Time", color: "bg-indigo-600" },
    { label: "Balance", color: "bg-pink-400" },
  ];
  const {
    data: DeepAnalysis,
    isLoading,
    isError,
    error
  } = useFetch("DeepAnalysis", Api.GetDeepAnalysis(),{ enabled: activeTab === 0 });
  const {
    data: PersonalizedInsight,
    isLoading: PersonalizedInsightLoading,
    isError: PersonalizedInsightError,
    error: PersonalizedInsightErrorData
  } = useFetch("PersonalizedInsight", Api.GetPersonalizedInsight(),{ enabled: activeTab === 1 });
  const {
    data: EvolutionPath,
    isLoading: EvolutionPathtLoading,
    isError: EvolutionPathError,
    error: EvolutionPathErrorData
  } = useFetch("EvolutionPath", Api.GetEvolutionPath(),{ enabled: activeTab === 3 });
  const {
    data: SmartRecommendations,
    isLoading: SartRecommendationsLoading,
    isError: SmartRecommendationsError,
    error: SmartRecommendationsErrorData
  } = useFetch("SmartRecommendations", Api.GetSmartRecommendations(),{ enabled: activeTab === 2 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8EA690] to-[#004236] text-white px-6 py-5 rounded-t-2xl relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 p-4 rounded-md text-white w-fit">
              <div className="h-10 w-10 bg-white bg-opacity-20 text-white text-xl rounded-full flex items-center justify-center">
                <LuBrain />
              </div>
              <div>
                <h2 className="text-2xl font-bold leading-none">
                  SoulPrint AI Engine
                </h2>
                <p className="text-md mt-1 text-white text-opacity-80">
                  Advanced Spiritual Intelligence & Insights
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* <button className="bg-white/20 flex items-center gap-2 p-2 rounded-lg hover:bg-white/30">
                <FaSyncAlt /> Refresh
              </button> */}
              <button
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30"
                onClick={() => setIsOpen()}
              >
                <IoMdClose />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 bg-white bg-opacity-20 py-2 px-2 rounded flex flex-wrap justify-center sm:justify-between gap-2 sm:gap-4">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 flex items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm transition-colors duration-200 whitespace-nowrap ${
                  activeTab === index
                    ? "bg-white text-[#004236]"
                    : "bg-[#004236] text-white hover:bg-white/20"
                }`}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto ">
          {activeTab === 0 &&
            (isLoading ? (
              <Loading msg={"Generating your spiritual analysis..."} />
            ) : isError ? (
              <ErrorMessage
                message={
                  error?.message || "An error occurred while fetching your spiritual analysis."
                }
              />
            ) : (
              <div className="space-y-4 px-6 py-6">
                <div className="bg-violet-50 rounded-xl p-6 mb-6">
                  <h4 className="text-xl flex items-center gap-3 text-black font-medium mb-1">
                    <span>
                      <FaRegStar className="text-[#004236] text-2xl" />
                    </span>{" "}
                    Your Spiritual Archetype
                  </h4>
                  <h2 className="text-3xl font-bold text-[#004236] my-2">
                    {DeepAnalysis?.data?.spiritualArchetype}
                  </h2>
                  <p className="text-md text-gray-600 mb-2">
                    Spiritual Age:{" "}
                    <span className="text-[#004236] font-medium">
                      {DeepAnalysis?.data?.spiritualAge}
                    </span>
                  </p>
                  <p className="text-gray-700 text-md">
                    {DeepAnalysis?.data?.corePattern}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dominant Keys */}
                  <div className="bg-[#8EA690] p-4 rounded-lg border border-green-100">
                    <h4 className="text-green-700 font-semibold text-base mb-2">
                      ⚡ Dominant Keys
                    </h4>
                    <ul className="text-green-700  font-semibold text-[1.1rem] space-y-1 pl-4 list-disc">
                      {DeepAnalysis?.data?.dominantKeys?.map(
                        (key: string, index: number) => (
                          <li key={index}>{key}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Growth Opportunities */}
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h4 className="text-orange-700 font-semibold text-base mb-2">
                      🎯 Growth Opportunities
                    </h4>
                    <ul className="text-orange-700 font-semibold text-[1.1rem] space-y-1 pl-4 list-disc">
                      {DeepAnalysis?.data?.growthKeys?.map(
                        (key: string, index: number) => (
                          <li key={index}>{key}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 flex items-start gap-3">
                  <div className="text-2xl mt-1 text-blue-500">
                    <BsStars />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800 text-lg mb-2">
                      Your Spiritual Gifts
                    </div>
                    <div className="text-blue-800 text-base">
                      {DeepAnalysis?.data?.giftPattern}
                    </div>
                  </div>
                </div>

                {/* Shadow Work Areas */}
                <div className="bg-red-50 rounded-xl border border-red-100 p-4 flex items-start gap-3">
                  <div className="text-2xl mt-1 text-rose-800">
                    <RiFootballFill />
                  </div>
                  <div>
                    <div className="font-bold text-rose-800 text-lg mb-1">
                      Shadow Work Areas
                    </div>
                    <div className="text-rose-700 text-base">
                      {DeepAnalysis?.data?.shadowWork}
                    </div>
                  </div>
                </div>

                {/* Next Evolution Phase */}
                <div className="bg-green-50 rounded-xl border border-green-100 p-4 flex items-start gap-3">
                  <div className="text-2xl mt-1 text-emerald-700">
                    <GoGoal />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-700 text-lg mb-1">
                      Next Evolution Phase
                    </div>
                    <div className="text-emerald-600 text-base">
                      {DeepAnalysis?.data?.evolutionPath}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {activeTab === 1 &&
            (PersonalizedInsightLoading ? (
              <Loading msg="Generating your personalized insight...."/>
            ) : PersonalizedInsightError ? (
              <ErrorMessage
                message={
                 PersonalizedInsightErrorData?.message || "Failed to generate your personalized insight please try again"
                }
              />
            ) : (
              <div className="space-y-6 px-6 py-6">
                {/* Insight Box */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                  <div className="flex items-start gap-2 mb-4">
                    <span className="text-yellow-500 text-xl">💡</span>
                    <h3 className="font-semibold text-xl text-gray-800">
                      {PersonalizedInsight?.data?.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-[1.15rem] mb-4">
                    {PersonalizedInsight?.data?.insight}
                  </p>
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">
                      Focus Key :{" "}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                      <span className="text-base font-medium text-gray-800">
                        {PersonalizedInsight?.data?.keyFocus}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Affirmation Box */}
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
                  <h4 className="text-[004236] text-base font-semibold mb-2 flex items-center gap-1">
                    💜 Your Personal Affirmation
                  </h4>
                  <p className="italic text-[#004236] font-medium text-xl">
                    "{PersonalizedInsight?.data?.affirmation}"
                  </p>
                </div>

                <div className=" bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-indigo-800 font-semibold mb-4">
                    <FaArrowRight className="text-lg" />
                    <span>Today's Action Steps</span>
                  </div>
                  <ol className="space-y-3  ">
                    {PersonalizedInsight?.data?.actionSteps?.map(
                      (step: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-semibold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-base text-indigo-800">
                            {step}
                          </span>
                        </li>
                      )
                    )}
                  </ol>
                </div>
              </div>
            ))}
          {activeTab === 2 &&
            (SartRecommendationsLoading ? (
              <Loading msg="Generating your smart practice recommendations...."/>
            ) : SmartRecommendationsError ? (
              <ErrorMessage message= {SmartRecommendationsErrorData?.message || "Failed to generate your smart practice recommendations please try again"} />
            ) : (
              <div className="space-y-4 px-6 py-6">
                <PracticeCard
                  title={SmartRecommendations?.data?.title}
                  level={SmartRecommendations?.data?.difficulty}
                  levelColor="green"
                  description={SmartRecommendations?.data?.description}
                  time={SmartRecommendations?.data?.duration}
                  type={SmartRecommendations?.data?.type}
                  borderColor="border-blue-200"
                  keys={[
                    {
                      label: SmartRecommendations?.data?.key,
                      color: "bg-red-500",
                    },
                  ]}
                />
                {/* <PracticeCard
                title="Compassionate Perspective Shifting"
                level="intermediate"
                levelColor="yellow"
                description="Reflect on a recent situation that challenged your perspective. Write about it, focusing on understanding the other person's viewpoint with compassion. This exercise enhances your ability to see different perspectives while nurturing your inherent compassion."
                time="15 min"
                type="reflection"
                borderColor="border-gray-200"
                keys={[
                  { label: "Perspective", color: "bg-blue-500" },
                  { label: "Compassion", color: "bg-green-500" },
                ]}
              /> */}
              </div>
            ))}
          {activeTab === 3 &&
            (EvolutionPathtLoading ? (
              <Loading msg="Generating your evolution forecast....."/>
            ) : EvolutionPathError ? (
              <ErrorMessage
                message={
                 EvolutionPathErrorData?.message || "Failed to generate your evolution forecast please try again"
                }
              />
            ) : (
              <div className="space-y-5 px-6 py-6 ">
                {/* Current Evolution Phase */}
                <div className="bg-green-50 border-l-4 border-green-400 p-5 rounded-xl shadow flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-green-600 font-bold text-xl">
                    <FaArrowTrendUp />
                    Current Evolution Phase
                  </div>
                  <div className="pl-8">
                    <span className="block text-2xl font-semibold text-green-700">
                      {EvolutionPath?.data?.currentPhase}
                    </span>
                    <span className="block mt-1 text-green-900 text-sm">
                      Time to next level:{" "}
                      <span className="font-medium text-green-800">
                        Approximately {EvolutionPath?.data?.timeToNextLevel}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Upcoming Milestones */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl shadow p-5">
                  <div className="flex items-center gap-2 font-semibold text-blue-700 text-lg mb-3">
                    <GiTargetPrize className="text-blue-500" />
                    Upcoming Milestones
                  </div>
                  <ul className="space-y-2 text-blue-900 text-base list-disc pl-7">
                    {EvolutionPath?.data?.nextMilestones?.map(
                      (milestone: string, idx: number) => (
                        <li key={idx}>{milestone}</li>
                      )
                    )}
                  </ul>
                </div>
                <div className=" p-4 bg-white rounded-2xl border border-gray-100 shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked
                      readOnly
                      className="accent-orange-500"
                    />
                    <span className="text-lg font-semibold text-gray-900">
                      Projected Growth Potential
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {/* Left column */}
                    <div className="space-y-3">
                      {Object.entries(
                        (EvolutionPath?.data?.projectedGrowth as Record<
                          string,
                          number
                        >) || {}
                      )
                        .slice(0, 4)
                        .map(([label, percent], idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 py-1"
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-3 h-3 rounded-full ${
                                  growthData?.find(
                                    (item) =>
                                      item.label.toLocaleLowerCase() ===
                                      label.toLocaleLowerCase()
                                  )?.color
                                } inline-block`}
                              />
                              <span className="text-gray-700 text-base">
                                {label}
                              </span>
                            </span>
                            <span className="font-semibold text-gray-700">
                              {percent}%
                            </span>
                          </div>
                        ))}
                    </div>
                    {/* Right column */}
                    <div className="space-y-3">
                      {Object.entries(
                        (EvolutionPath?.data?.projectedGrowth as Record<
                          string,
                          number
                        >) || {}
                      )
                        .slice(4)
                        .map(([label, percent], idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 py-1"
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-3 h-3 rounded-full ${
                                  growthData?.find(
                                    (item) =>
                                      item.label.toLocaleLowerCase() ===
                                      label.toLocaleLowerCase()
                                  )?.color
                                } inline-block`}
                              />
                              <span className="text-gray-700 text-base">
                                {label}
                              </span>
                            </span>
                            <span className="font-semibold text-base text-gray-700">
                              {percent}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SoulPrintModal;

const PracticeCard = ({
  title,
  level,
  levelColor,
  description,
  time,
  type,
  keys,
  borderColor,
}: {
  title: string;
  level: string;
  levelColor: string;
  description: string;
  time: string;
  type: string;
  keys: { label: string; color: string }[];
  borderColor: string;
}) => {
  return (
    <div className={`rounded-xl p-5 border ${borderColor} space-y-2`}>
      {/* Title + Level */}
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize bg-${levelColor}-100 text-${levelColor}-700`}
        >
          {level}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700">{description}</p>

      {/* Time & Type */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>⏱ {time}</span>
        <span className="text-gray-400">•</span>
        <span>{type}</span>
      </div>

      {/* Keys */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">Keys: </span>
        {keys.map((key, index) => (
          <span key={index} className="inline-flex items-center gap-1 mr-3">
            <span className={`w-2 h-2 rounded-full ${key.color}`}></span>
            <span>{key.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Loading = ({msg}: {msg: string}) => (
  <div className="py-10 text-center text-gray-600 font-medium">{msg}</div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="py-10 text-center text-red-500 font-medium">{message}</div>
);
