import { useEffect, useRef, useState } from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import usePost from "../../hooks/usePost";
import Api from "../../services/SpiritualAi/AiSpiritual";
import { IoIosSend } from "react-icons/io";
import Api2 from "../../services/Auth/Auth";
import useFetch from "../../hooks/useFetch";

interface Message {
  role: "user" | "coach";
  content: string;
  time: string;
  coachingType?: string;
}

export default function AiCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "coach",
      content:
        "Hello! I'm your AI spiritual coach. I'm here to guide you through your spiritual journey using the 7 Keys framework. What would you like to focus on today?",
      time: "11:43",
      coachingType: "guidance",
    },
  ]);
  const [input, setInput] = useState("");
  const { post } = usePost();
  const { data } = useFetch("user", Api2.GetUser());
  
    useEffect(() => {
    if (data?.data?.userInfo && data?.data?.soulScore) {
      const { firstName, level } = data?.data?.userInfo;
      const {
        belief, gratitude, compassion, resilience,
        time, purpose, perspective, balance, totalScore,
      } = data?.data?.soulScore[0];
      
      const scores = { belief, gratitude, compassion, resilience, time, purpose, perspective, balance };
      const sortedKeys = Object.entries(scores).sort((a, b) => a[1] - b[1]);

      const lowest = sortedKeys[0][0];
      const highest = sortedKeys[sortedKeys.length - 1][0];

      const firstMsg: Message = {
        role: "coach",
        coachingType: "guidance",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: `Hi ${firstName}, welcome to your spiritual journey. Based on your latest Soul Score of ${totalScore}, you're currently at the ${level} level.\nYour strength seems to be ${highest}, while ${lowest} might need some extra attention.\nWhat would you like to focus on today?`,
      };

      setMessages([firstMsg]);
    }
  }, [data]);

         useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: "user",
      content: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const recentMessages = updatedMessages
        .slice(-4)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
          ...(msg.role === "coach" && { coachingType: msg.coachingType }),
        }));

      const Payload = {
        userMessage: input,
        conversationHistory: recentMessages,
      };


      const {data:response, error} = await post(Api.AskAiCoach(), Payload);

      const reply: Message = {
        role: "coach",
        content: response?.data || error || "Error fetching AI response",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        coachingType: "guidance",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("Error fetching AI response", err);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  return (
   <div className="w-full h-[calc(100vh-7.5rem)] flex items-center justify-center bg-gray-100 pt-1">
  <div className="flex flex-col h-full w-full max-w-full border rounded-xl shadow-lg overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-center px-2 gap-3 py-6 bg-white  flex-shrink-0">
      {/* Icon in circle */}
      <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-r from-[#8EA690] to-[#004236] rounded-full">
        <FaRobot className="text-white text-2xl" />
      </div>
      {/* Textual info */}
      <div>
        <div className="text-xl sm:text-2xl font-semibold text-gray-900 ">
          AI Spiritual Coach
        </div>
        <div className="text-xs sm:text-sm text-gray-500 font-normal ">
          Personalized guidance for your spiritual journey
        </div>
      </div>
    </div>

    {/* Chat area */}
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-gray-50">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-end ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {/* coach icon (left side) */}
          {msg.role === "coach" && (
            <div className="w-7 h-7 mr-2 bg-gradient-to-r from-[#8EA690] to-[#004236] flex items-center justify-center rounded-full text-white">
              <FaRobot />
            </div>
          )}

          {/* Message bubble */}
          <div
            className={`max-w-[70%] px-4 py-2 rounded-xl text-xs sm:text-sm ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-700 rounded-bl-none"
            }`}
          >
            {msg.content}
            <div className="text-[10px] text-gray-300 mt-1 text-right">
              {msg.time}
            </div>
          </div>

          {/* USER icon (right side) */}
          {msg.role === "user" && (
            <div className="w-7 h-7 ml-2 rounded-full text-white flex items-center justify-center bg-gray-400">
              <FaUser />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    {/* Input area */}
    <div className="flex items-center p-4 border-t bg-white flex-shrink-0">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004236]"
        placeholder="Share what's on your mind or ask for guidance..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <button
        onClick={sendMessage}
        disabled={input === ""}
        className="ml-3 bg-[#004236] hover:bg-[#004236] text-white px-6 py-2 rounded-md text-xl"
      >
        <IoIosSend />
      </button>
    </div>
  </div>
</div>

  );
}
