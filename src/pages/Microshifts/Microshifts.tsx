import { FaStar } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import Api from "../../services/microshifts/Microshifts";
import Api2 from "../../services/StKey/StKey";
import { useEffect, useState } from "react";
import usePost from "../../hooks/usePost";
import type { Mircroshift } from "../../types/microshift";
import { useQueryClient } from "@tanstack/react-query";
import DisscussWithAi from "../../components/Modal/DisscussWithAi";
import Skeleton from "../../components/Skelton/Skelton";
import type { Key } from "../../types/key";
import SoulLog from "../../components/Modal/soulLog";

function Microshifts() {
  const [Microshiftsdata, setMicroshiftsdata] = useState<any>(null);
  const [pageKey, setPageKey] = useState(null);
  const [AllMicroshiftpageKey, setAllMicroshiftPageKey] = useState(null);
  const [currentKey, setCurrentKey] = useState("");
  const [modalId, setModalId] = useState(0);
  const [type, setType] = useState("");
  const [AllMicroshifts, setAllMicroshifts] = useState<Mircroshift[]>([]);
  const [keys2, setKeys2] = useState<Key[]>([]);
  const [open, setOpen] = useState(false);
  const [prevKeys, setPrevKeys] = useState([]);
  const [AllMicroshiftprevKeys, setAllMicroshiftPrevKeys] = useState([]);
  const queryClient = useQueryClient();
  const [microshiftDetails, setMicroshiftDetails] = useState({
    microShiftId: "",
    text: "",
    stKeyName: "",
    type: "",
    duration: 0,
    tone: "",
    goal: "",
    alignmentFocus: "",
  });

  const url = Api.MicroShiftsHistory(pageKey || "");
  const { post, loading, error: postError } = usePost();
  const { data, isLoading, error } = useFetch<Mircroshift[]>(
    "microshifts",
    Api.getDailyMicroshifts()
  );
  const { data: key } = useFetch<{ data: Key[] }>("key", Api2.GetKeys());
  const {
    data: microshift,
    isLoading: isLoadingMicro,
    error: errorMicro,
  } = useFetch(
    ["Allmicroshift",currentKey, AllMicroshiftpageKey],
    Api.GetAllMicroshifts(currentKey,AllMicroshiftpageKey ?? "")
  );


  useEffect(() => {
  const filtered = microshift?.data?.items?.filter((item : Mircroshift) => {
      const keyMatch = currentKey
        ? item.stKeyName?.toLowerCase() === currentKey.toLowerCase()
        : true;
      const typeMatch = type
        ? item.type?.toLowerCase() === type.toLowerCase()
        : true;
      return keyMatch && typeMatch;
    });

    setAllMicroshifts(filtered || []);
  }, [currentKey, type, microshift?.data?.items]);
  useEffect(() => {
    if (key) {
      setKeys2(key?.data);
    }
  }, [key]);
  const {
    data: MicroshiftsHistory,
    isLoading: isLoadingHistory,
    error: errorHistory,
  } = useFetch(["microshiftsHistory", pageKey], url, {
    enabled: true,
  });

  const IsSubmmited = MicroshiftsHistory?.data?.items?.some(
    (item: Mircroshift) => item.microShiftId === Microshiftsdata?.data?.id
  );

  useEffect(() => {
    if (data) {
      setMicroshiftsdata(data);
    }
  }, [data]);

  const setIsOpen = () => {
    setOpen(!open);
  };

  async function markComplete(
    microShiftId: string,
    text: string,
    stKeyName: string,
    type: string,
    duration: number,
    tone: string,
    goal: string,
    alignmentFocus: string
  ) {
    await post(Api.MarkAsDoneMicroshifts(), {
      ...(microShiftId && {
        microShiftId: microShiftId,
      }),
      text: text,
      stKeyName: stKeyName,
      type: type,
      duration: duration,
      tone: tone,
      goal: goal,
      alignmentFocus: alignmentFocus,
    });
    queryClient.invalidateQueries({ queryKey: ["microshiftsHistory"] });
  }

  const handleNext = () => {
    if (MicroshiftsHistory?.data?.lastKey) {
      setPrevKeys((prev) => [...prev, pageKey!]);
      setPageKey(MicroshiftsHistory?.data?.lastKey);
    }
  };

  const handlePrev = () => {
    const keys = [...prevKeys];
    const prev = keys.pop() || null;
    setPrevKeys(keys);
    setPageKey(prev);
  };

    const handleMicroshiftNext = () => {
    if (microshift?.data?.lastKey) {
      setAllMicroshiftPrevKeys((prev) => [...prev, AllMicroshiftpageKey!]);
      setAllMicroshiftPageKey(microshift?.data?.lastKey);
    }
  };

  const handleMicroshiftPrev = () => {
    const keys = [...AllMicroshiftprevKeys];
    const prev = keys.pop() || null;
    setAllMicroshiftPrevKeys(keys);
    setAllMicroshiftPageKey(prev);
  };

  return (
    <div className="pt-4 md:pt-5 min-h-[calc(100vh-7.5rem)]">
      <div className=" bg-white ">
        {/* Header */}
        <div className="bg-[#004236] text-white text-xl sm:text-3xl font-semibold py-5 px-[1rem] md:px-[3rem] lg:px-[6rem]  shadow-md">
          Spiritual Transformation
        </div>

        <div className="container mx-auto ">
          {isLoading ? (
            <Skeleton />
          ) : error ? (
            <div>Something went wrong</div>
          ) : (
            <div className="bg-white border rounded-lg shadow px-6 py-3 my-6 w-full">
              {/* Header */}
              <div className="flex flex-row  sm:justify-between sm:items-center gap-2 mb-4">
                <h2 className="text-lg sm:text-[1.6rem] md:text-[1.8rem] lg:text-[2.1rem] font-semibold text-gray-800">
                  Today's Recommended {Microshiftsdata?.data?.type}
                </h2>
                <span className="text-sm font-semibold text-gray-700 flex justify-center items-center flex-col gap-2">
                  <span> {Microshiftsdata?.data?.duration} Mins</span>
                  <span className="text-white px-2 py-0.5 rounded-md bg-[#004236]">{Microshiftsdata?.data?.stKeyName}</span>
                 
                </span>
              </div>

              {/* Card content */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Icon and Text */}
                <div className="flex items-center sm:items-start flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#004236] rounded-full flex items-center justify-center flex-shrink-0">
                      <FaStar className="text-white w-3 h-3 md:w-5 md:h-5" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center sm:items-start">
                    <h3 className="text-xl font-poppins  font-semibold text-start text-gray-900">
                      {Microshiftsdata?.data?.goal}
                    </h3>
                    <p className="text-md font-regular text-center sm:text-start text-gray-500">
                      {Microshiftsdata?.data?.text}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center w-full mt-4">
                  <button
                    className={` text-white px-2 py-1 sm:px-4 sm:py-2 text-sm rounded-md font-semibold  flex gap-2 ${
                      IsSubmmited
                        ? "bg-[#8EA690] "
                        : "bg-[#004236] hover:bg-[#8EA690]"
                    }`}
                    onClick={() =>
                      markComplete(
                        Microshiftsdata?.data?.id,
                        Microshiftsdata?.data?.text!,
                        Microshiftsdata?.data?.stKeyName!,
                        Microshiftsdata?.data?.type!,
                        Microshiftsdata?.data?.duration!,
                        Microshiftsdata?.data?.tone!,
                        Microshiftsdata?.data?.goal!,
                        Microshiftsdata?.data?.alignmentFocus!
                      )
                    }
                    disabled={IsSubmmited}
                  >
                    {loading && (
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
                    )}
                    Mark Complete
                  </button>
                  <button
                   className="bg-[#004236] text-white px-4 py-2 rounded-md hover:bg-[#8EA690]"
                   onClick={()=>{
                    setMicroshiftDetails({
                        microShiftId: Microshiftsdata?.data?.id,
                        text: Microshiftsdata?.data?.text,
                        stKeyName: Microshiftsdata?.data?.stKeyName,
                        type: Microshiftsdata?.data?.type,
                        duration: Microshiftsdata?.data?.duration,
                        tone: Microshiftsdata?.data?.tone,
                        goal: Microshiftsdata?.data?.goal,
                        alignmentFocus: Microshiftsdata?.data?.alignmentFocus,
                      });
                    setModalId(1);
                    setOpen(true);
                   }}>
                    Log in Soulog
                  </button>
                  <button
                    className="bg-[#004236] text-white px-2 py-1 sm:px-4 sm:py-2 text-sm rounded-md font-semibold rounded-md hover:bg-[#8EA690]"
                    onClick={() => {
                      setModalId(0);
                      setMicroshiftDetails({
                        microShiftId: Microshiftsdata?.data?.id,
                        text: Microshiftsdata?.data?.text,
                        stKeyName: Microshiftsdata?.data?.stKeyName,
                        type: Microshiftsdata?.data?.type,
                        duration: Microshiftsdata?.data?.duration,
                        tone: Microshiftsdata?.data?.tone,
                        goal: Microshiftsdata?.data?.goal,
                        alignmentFocus: Microshiftsdata?.data?.alignmentFocus,
                      });
                      setOpen(true);
                    }}
                  >
                    Discuss with AI Coach
                  </button>
                </div>
              </div>
              {postError && <div className="text-red-500">{postError}</div>}
            </div>
          )}

          {/* Recent Entries */}
          <Card className="mt-6 p-2 sm:p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
            <ul className="space-y-3">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-40">
                  <svg
                    aria-hidden="true"
                    className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                <p className="text-red-500">Something went wrong</p>
              ) : (
                MicroshiftsHistory?.data?.items.map(
                  (microshift: Mircroshift, index: number) => (
                    <li
                      key={index}
                      className="border p-3 rounded text-sm flex justify-between items-start"
                    >
                      <span>
                        {microshift.text}
                        <br />
                        <span className="text-xs text-gray-500">
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
            </ul>
            <div className="flex justify-between items-center my-2">
              <button
                onClick={handlePrev}
                disabled={prevKeys?.length === 0}
                className={`px-4 py-2 rounded-md text-white ${
                  prevKeys?.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#004236] hover:bg-[#8EA690]"
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!MicroshiftsHistory?.data?.lastKey}
                className={`px-4 py-2 rounded-md text-white ${
                  !MicroshiftsHistory?.data?.lastKey
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#004236] hover:bg-[#8EA690]"
                }`}
              >
                Next
              </button>
            </div>
          </Card>
          {/* Explore Microshifts */}
          <Card className="my-6 p-2 sm:p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Explore Microshifts</h2>
            <div className="flex flex-wrap justify-between gap-2 mb-4 px-4">
              <select
                className="w-60  border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004236]"
                onChange={(e) => {
                  setCurrentKey(e.target.value);
                   setAllMicroshiftPageKey(null);
                  setAllMicroshiftPrevKeys([]);
                }}
                value={currentKey}
              >
                <option value="">select key</option>
                {keys2.map((key) => (
                  <option key={key.id} value={key.name.toLocaleLowerCase()}>
                    {key.name}
                  </option>
                ))}
              </select>
              <select
                className="w-60 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004236]"
                value={type}
                onChange={(e) => {setType(e.target.value);
                 
                }}
              >
                <option value="">Choose a type</option>
                <option value="reflection">Reflection</option>
                <option value="breathwork">Breathwork</option>
                <option value="mantra">Mantra</option>
                <option value="ritual">Ritual</option>
                <option value="action">Action</option>
                <option value="reframe">Reframe</option>
                <option value="sound Temple">Sound Temple</option>
              </select>
            </div>
            <div className="px-1 sm:px-4 ">
              {isLoadingMicro ? (
                <div className="flex items-center justify-center h-40">
                  <svg
                    aria-hidden="true"
                    className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              ) : errorMicro ? (
                <p className="text-red-500">Something went wrong </p>
              ) : (
                AllMicroshifts?.map(
                  (microshift: Mircroshift, index: number) => {
                    const IsSubmmited = MicroshiftsHistory?.data?.items?.some(
                      (item: Mircroshift) =>
                        item.microShiftId === microshift?.id
                    );
                    return (
                      <div
                        className="bg-white border rounded-lg shadow px-3 sm:px-6 py-3 my-6 "
                        key={index}
                      >
                        {/* Header */}
                         <div className="w-full flex justify-end">
                           <span className="text-sm font-semibold text-gray-700 text-end flex flex-col justify-center items-center gap-2 ">
                           <span>{microshift?.duration} Min</span>
                           <span className="text-white px-2 py-0.5 rounded-md bg-[#004236]">{microshift?.stKeyName}</span>
                            
                          </span>
                         </div>
                         
                        

                        {/* Card content */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          {/* Icon and Text */}
                          <div className="flex items-center sm:items-start flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <div className="h-full  flex items-center justify-center">
                              <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#004236] rounded-full flex items-center justify-center flex-shrink-0">
                                <FaStar className="text-white w-3 h-3 md:w-5 md:h-5" />
                              </div>
                            </div>

                            <div className="flex flex-col justify-center items-center sm:items-start">
                              <h3 className="text-xl font-poppins  font-semibold text-start text-gray-900">
                                {microshift?.goal}
                              </h3>
                              <p className="text-md font-regular text-center sm:text-start text-gray-500">
                                {microshift?.text}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center w-full mt-4">
                            <button
                              className={` text-white px-2 py-1 sm:px-4 sm:py-2 text-sm rounded-md font-semibold  flex gap-2 ${
                                IsSubmmited
                                  ? "bg-[#004236] "
                                  : "bg-[#004236] hover:bg-[#8EA690]"
                              }`}
                              onClick={() =>
                                markComplete(
                                  microshift?.id,
                                  microshift?.text!,
                                  microshift?.stKeyName!,
                                  microshift?.type!,
                                  microshift?.duration!,
                                  microshift?.tone!,
                                  microshift?.goal!,
                                  microshift?.alignmentFocus!
                                )
                              }
                              disabled={IsSubmmited}
                            >
                              {loading && (
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
                              )}
                              Mark Complete
                            </button>
                            <button 
                            className="bg-[#004236] text-white px-4 py-2 rounded-md hover:bg-[#8EA690]"
                            onClick={() => {
                              setMicroshiftDetails({
                                  microShiftId: microshift?.id,
                                  text: microshift?.text!,
                                  stKeyName: microshift?.stKeyName!,
                                  type: microshift?.type!,
                                  duration: microshift?.duration!,
                                  tone: microshift?.tone!,
                                  goal: microshift?.goal!,
                                  alignmentFocus: microshift?.alignmentFocus!,
                                });
                                setModalId(1);
                                setOpen(true);
                            }}
                            >Log in Soulog
                            </button>
                            <button
                              className="bg-[#004236] text-white px-2 py-1 sm:px-4 sm:py-2 text-sm rounded-md font-semibold rounded-md hover:bg-[#8EA690]"
                              onClick={() => {
                                setMicroshiftDetails({
                                  microShiftId: microshift?.id,
                                  text: microshift?.text!,
                                  stKeyName: microshift?.stKeyName!,
                                  type: microshift?.type!,
                                  duration: microshift?.duration!,
                                  tone: microshift?.tone!,
                                  goal: microshift?.goal!,
                                  alignmentFocus: microshift?.alignmentFocus!,
                                });
                                setModalId(0);
                                setOpen(true);
                              }}
                            >
                              Discuss with AI Coach
                            </button>
                          </div>
                        </div>
                        {postError && (
                          <div className="text-red-500">{postError}</div>
                        )}
                      </div>
                    );
                  }
                )
              )}
              <div className="flex justify-between items-center my-2">
              <button
                onClick={handleMicroshiftPrev}
                disabled={AllMicroshiftprevKeys?.length === 0}
                className={`px-4 py-2 rounded-md text-white ${
                  AllMicroshiftprevKeys?.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#004236] hover:bg-[#8EA690]"
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleMicroshiftNext}
                disabled={!microshift?.data?.lastKey}
                className={`px-4 py-2 rounded-md text-white ${
                  !microshift?.data?.lastKey
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#004236] hover:bg-[#8EA690]"
                }`}
              >
                Next
              </button>
            </div>
            </div>
          </Card>
        </div>
      </div>
      {
     modalId===0 &&   <DisscussWithAi
          isOpen={open}
          setIsOpen={setIsOpen}
          stKeyName={microshiftDetails?.stKeyName}
          alignmentFocus={microshiftDetails?.alignmentFocus}
          goal={microshiftDetails?.goal}
          tone={microshiftDetails?.tone}
          text={microshiftDetails?.text}
          Type={microshiftDetails?.type}
          duration={microshiftDetails?.duration}
        />
      }
      {
        modalId===1 && <SoulLog
          isOpen={open}
          setIsOpen={setIsOpen}
          prompt={microshiftDetails?.text}/>
      }
    </div>
  );
}

export default Microshifts;

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
