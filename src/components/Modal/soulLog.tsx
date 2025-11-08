import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Api from "../../services/SoulLog/SoulLog";
import type { modal } from "../../types/modal";
import useFetch from "../../hooks/useFetch";
import usePost from "../../hooks/usePost";

export default function SoulLog({ isOpen, setIsOpen, prompt:propsPrompt }: modal) {
  const [isError, setIsError] = useState("");
  const [Prompt, setPrompt] = useState("");
  const [Answer, setAnswer] = useState("");



  const { data } = useFetch("prompt", Api.GetPrompt());
  const { post } = usePost();

useEffect(() => {
  if (!isOpen) return;
  if (propsPrompt) {
    setPrompt(propsPrompt);
  } else if (data?.data) {
    setPrompt(data.data);
  }
}, [isOpen, propsPrompt, data?.data]);


  const submitPrompt = async (e: React.FormEvent) => {
    if(!Prompt) return setIsError("Prompt is required");
    e.preventDefault();
    setIsError("");
    try {
      await post(Api.AnswerPrompt(), {
        prompt: Prompt,
        answer: Answer,
      });
      setIsOpen(false);
      setAnswer("");
    } catch (err) {
      setIsError((err as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8EA690] to-[#004236] rounded-t-2xl p-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">SoulLog™</h2>
            <p className="text-sm">{new Date().toDateString()}</p>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Today's Reflection Prompt</h3>
          <div className="bg-[#acc2ae] border border-[#8EA690] text-sm text-gray-700 rounded-md p-3 mb-4">
            {Prompt || "Loading..."}
          </div>

          <label htmlFor="thoughts" className="block font-medium text-sm text-gray-700 mb-1">
            Your thoughts:
          </label>
          <textarea
            id="thoughts"
            value={Answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Start writing your thoughts..."
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[120px]"
          ></textarea>

          {isError && <p className="text-red-500 mt-2">{isError}</p>}

          <button
            className="mt-4 w-full bg-[#004236] hover:bg-emerald-500 text-white font-semibold py-2 rounded-md transition duration-200"
            onClick={submitPrompt}
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
