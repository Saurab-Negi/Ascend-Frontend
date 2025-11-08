import { IoIosSend, IoMdClose } from "react-icons/io";
import type { modal } from "../../types/modal";
import { FaRobot, FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Api from "../../services/microshifts/Microshifts";
import usePost from "../../hooks/usePost";

interface Message {
  role: "user" | "coach";
  content: string;
  time: string;
  coachingType?: string;
}

function DisscussWithAi({
  isOpen,
  setIsOpen,
  stKeyName,
  alignmentFocus,
  goal,
  tone,
  text,
  Type,
  duration,
}: modal) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "coach",
      content: `Hello! Today’s MicroShift invites you to ${text}. Are you ready?`,
      time: "11:43",
      coachingType: "guidance",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { post } = usePost();


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
      const recentMessages = updatedMessages.slice(-4).map((msg) => ({
        role: msg.role,
        content: msg.content,
        ...(msg.role === "coach" && { coachingType: msg.coachingType }),
      }));

      const Payload = {
        stKeyName: stKeyName,
        alignmentFocus: alignmentFocus,
        goal: goal,
        tone: tone,
        text: text,
        type: Type,
        duration: duration,
        userMessage: input,
        conversationHistory: recentMessages,
      };

      const {data: response, error} = await post(Api.DisscussMicroshiftsWithAi(), Payload);
  if(response?.data || error ){
    const reply:  Message = {
      role: "coach",
      content:  response?.data || error,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      coachingType: "guidance",
    };

    setMessages((prev) => [...prev, reply]);
  }

    } catch (err) {
      console.error("Error fetching AI response", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "coach",
        content: `Hello! Today’s MicroShift invites you to ${text}. Are you ready?`,
        time: "11:43",
        coachingType: "guidance",
      },
    ]);
  }, [text]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl relative  ">
        {/* header */}
        <div className="bg-gradient-to-r from-[#8EA690] to-[#004236] rounded-t-2xl p-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Predictive AI Guidance</h2>
            <p className="text-sm ">Personalized insights from your spiritual journey patterns</p>
            <p className="text-sm">{new Date().toDateString()}</p>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <IoMdClose size={20} />
          </button>
        </div>
        <div className="">
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-gray-50 h-[50vh]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* coach icon (left side) */}
                {msg.role === "coach" && (
                  <div className="w-7 h-7 mr-2 bg-gradient-to-r from-blue-500 to-[#004236] flex items-center justify-center rounded-full text-white">
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
    </div>
  );
}

export default DisscussWithAi;
