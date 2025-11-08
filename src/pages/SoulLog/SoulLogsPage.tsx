import { useEffect, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { FaLock, FaMicrophone, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";
import Api from "../../services/SoulLog/SoulLog";
import useFetch from "../../hooks/useFetch";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import usePost from "../../hooks/usePost";
import type { Mircroshift } from "../../types/microshift";
import { useQueryClient } from "@tanstack/react-query";
import AskToAi from "../../components/Modal/AskToAi";

function SoulLogsPage() {
  const [isopen, setisOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [Prompt, setPrompt] = useState("");
  const [isError, setIsError] = useState("");
   const [open, setOpen] = useState(false);
  const [isSacred, setIsSacred] = useState(false);
  const [pageKey, setPageKey] = useState(null);
  const [prevKeys, setPrevKeys] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [entryText, setEntryText] = useState("");

  const queryClient = useQueryClient();

  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  



  const { data } = useFetch("prompt", Api.GetPrompt());
  const {
    data: PromptHistory,
    isLoading: isLoadingHistory,
    error: errorHistory,
  } = useFetch(["PromptHistory", pageKey], Api.PromptHistory(pageKey || ""), {
    enabled: true,
  });
  const { post } = usePost();

  useEffect(() => {
    if (data?.data) {
      setPrompt(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (transcript) {
      setEntryText(transcript);
    }
  }, [transcript]);

  function toggleListening() {
    if (isRecording) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
      setIsRecording(true);
    }
  }

   const setIsOpen = () => {
    setOpen(!open);
  };

  const submitPrompt = async (e: React.FormEvent) => {
    if (!entryText) return setIsError("Prompt is required");
    e.preventDefault();
    setIsError("");
    try {
      await post(Api.AnswerPrompt(), {
        prompt: Prompt,
        answer: entryText,
        isSacred: isSacred,
      });
      queryClient.invalidateQueries({ queryKey: ["PromptHistory"] });
      setEntryText("");
    } catch (err) {
      setIsError((err as Error).message);
    }
  };

  const handleNext = () => {
    if (PromptHistory?.data?.lastKey) {
      setPrevKeys((prev) => [...prev, pageKey!]);
      setPageKey(PromptHistory?.data?.lastKey);
    }
  };

  const handlePrev = () => {
    const keys = [...prevKeys];
    const prev = keys.pop() || null;
    setPrevKeys(keys);
    setPageKey(prev);
  };

  function toggleprompt() {
    setisOpen(!isopen);
  }

  function toggleSacred() {
    setIsSacred(!isSacred);
    setEnabled(!enabled);
  }

  function getBrowserName() {
    const ua = navigator.userAgent;

    if ((navigator as any).brave) return "Brave"; // must be before Chrome check
    if (ua.includes("Edg/")) return "Edge";
    if (ua.includes("Chrome") && !ua.includes("Edg/") && !ua.includes("OPR/"))
      return "Chrome";
    if (ua.includes("OPR/")) return "Opera";
    if (ua.includes("SamsungBrowser")) return "Samsung Internet";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";

    return "Unknown";
  }

  const browser = getBrowserName();

  const supportedBrowsers = ["Chrome", "Edge", "Opera", "Samsung Internet"];

  let CharLength = entryText.split(" ").join("").length;


  return (
    <div className="pt-5 min-h-[calc(100vh-7.5rem)]">
      <div className=" bg-white ">
        {/* Header */}
        <div className="bg-[#004236] flex gap-2 align-center text-white text-2xl font-semibold py-5 px-[1rem] md:px-[3rem] lg:px-[6rem]  shadow-md">
          <IoBookOutline className="mt-1.5 text-2xl" />
          SoulLog™
        </div>
        <div className="container mx-auto ">
          <div className=" p-4 space-y-6 font-sans">
            {/* Daily Soul Prompt */}
            <div className="border rounded-lg p-4 flex items-start gap-3">
              <div className="text-[#004236] text-2xl mt-1">
                <HiOutlineSparkles />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold mb-3">
                  Daily Soul Prompt
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {isopen && Prompt}
                </p>
              </div>
              <div
                className="ml-auto mt-1 text-lg sm:text-2xl"
                onClick={toggleprompt}
              >
                {isopen ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>

            {/* SoulLog Entry */}
            <div className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-md sm:text-xl">
                  <IoBookOutline className="mt-1.5 " />
                </span>
                <h3 className="text-sm sm:text-lg font-semibold">
                  SoulLog™ Entry
                </h3>
                <div className="ml-auto flex items-center gap-1 text-sm text-gray-600">
                  <span>
                    <div
                      className={`w-10 h-5 flex items-center  rounded-full p-1  cursor-pointer transition-colors ${
                        enabled ? "bg-[#004236]" : "bg-gray-300"
                      }`}
                      onClick={() => toggleSacred()}
                    >
                      <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ease-in-out ${
                          enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </span>{" "}
                  <span className="text-xs sm:text-base text-gray-600">
                    {" "}
                    Sacred Entry
                  </span>
                </div>
              </div>
              {enabled && (
                <div className="text-sm sm:text-lg mb-2 text-amber-600  bg-amber-50 flex gap-2 px-2 py-1  items-center justify-center rounded ">
                  <FaLock /> Sacred mode: Your entry will be private and won't
                  be analyzed for insights or XP
                </div>
              )}
              <textarea
                rows={4}
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="What is your heart calling you to explore today? Let your thoughts flow"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EA690]"
              ></textarea>
              {!browserSupportsSpeechRecognition ||
              !supportedBrowsers.includes(browser) ? (
                <span className="text-red-500">
                  Your browser does not support speech recognition, please use a
                  supported browser.
                </span>
              ) : null}
              <div className="flex justify-between gap-2 sm:flex-row flex-col items-center mt-3">
               <div className="flex gap-2 sm:flex-row flex-col items-center justify-center">
                 <button
                  onClick={toggleListening}
                  className={`border flex gap-2 text-md font-semibold border-[#004236] px-4 py-2 rounded-md text-[#004236] hover:text-[#8EA690] items-center ${
                    isRecording ? "bg-[#8EA690]" : ""
                  }`}
                >
                  <FaMicrophone />{" "}
                  {isRecording ? "Pause Listening" : "Start Voice"}
                </button>
                 
                 <p className="text-sm text-gray-600">{ CharLength} characters</p>
               </div>
               
               <button
                  className="bg-[#004236] flex gap-2 items-center hover:bg-[#8EA690] text-white px-4 py-2 rounded-md text-sm"
                 onClick={() => setOpen(true)}
                >
                 Send to AI Coach
                </button>

                <button
                  className="bg-[#004236] flex gap-2 items-center hover:bg-[#8EA690] text-white px-4 py-2 rounded-md text-sm"
                  onClick={submitPrompt}
                >
                  <BsFillSendFill /> Save Entry
                </button>
              </div>
              <p className="text-red-500">{isError}</p>
            </div>

            {/* Recent Entries */}
            <div className="border rounded-lg p-6 bg-white">
              {/* Header */}
              <div className="flex items-center gap-2 mb-8">
                <IoBookOutline className="text-2xl mt-1" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Recent Entries
                </h2>
              </div>

              {/* Center Icon and Text */}
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-5">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              ) : errorHistory ? (
                <div className="text-red-500">Somthing went wrong</div>
              ) : PromptHistory?.data?.items?.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <IoBookOutline className="text-6xl text-gray-400 mb-4" />
                  <p className="text-md font-semibold text-gray-500">
                    Your Journal awaits your first entry
                  </p>
                  <p className="text-md text-gray-500 font-medium">
                    Begin your spiritual journey{" "}
                    <span className="pl-1">today</span>
                  </p>
                </div>
              ) : (
                PromptHistory?.data?.items.map(
                  (microshift: Mircroshift, index: number) => (
                    <li
                      key={index}
                      className="border  p-3 rounded text-sm flex mt-2 justify-between items-start"
                    >
                      <span>
                        {microshift?.prompt}
                        <br />
                        <span className="text-xs text-gray-500">
                          {microshift?.answer}
                        </span>
                        <br />
                        <span className="text-xs ">
                          {new Date(microshift.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </span>
                    </li>
                  )
                )
              )}
              <div className="flex justify-between items-center my-4">
                <button
                  onClick={handlePrev}
                  disabled={prevKeys.length === 0}
                  className={`px-4 py-2 rounded-md text-white ${
                    prevKeys.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#004236] hover:bg-[#8EA690]"
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!PromptHistory?.data?.lastKey}
                  className={`px-4 py-2 rounded-md text-white ${
                    !PromptHistory?.data?.lastKey
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#004236] hover:bg-[#8EA690]"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        <AskToAi
          isOpen={open}
          setIsOpen={setIsOpen}
          prompt={Prompt}
          />
      }
    </div>
  );
}

export default SoulLogsPage;
