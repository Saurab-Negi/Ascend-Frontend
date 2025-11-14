import { IoIosSend, IoMdClose } from "react-icons/io";
import type { modal } from "../../types/modal";
import { FaRobot, FaUser, FaMicrophone } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Api from "../../services/SoulLog/SoulLog";
import usePost from "../../hooks/usePost";
import speak from "../../utils/TextToSpeech";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";

interface Message {
  role: "user" | "coach";
  content: string;
  time: string;
  coachingType?: string;
}

function AskToAi({ isOpen, setIsOpen, AiType, prompt,GuideType }: modal) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "coach",
      content: `Hello! I am here to Guide you through your Soul Score. ${prompt}`,
      time: "11:43",
      coachingType: "guidance",
    },
  ]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("Tour");
  const [isRecording, setIsRecording] = useState(false);
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { post } = usePost();

  useEffect(()=>{
    if(GuideType==="Tour"){
      setStage("Tour");
    }else{
      setStage("Conversation");
    }
  },[GuideType]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
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
    SpeechRecognition.stopListening(); // Stop listening
    setIsRecording(false);
    resetTranscript(); // Clear transcript after sending message

    try {
      const recentMessages = updatedMessages.slice(-4).map((msg) => ({
        role: msg.role,
        content: msg.content,
        ...(msg.role === "coach" && { coachingType: msg.coachingType }),
      }));

      const Payload = {
        journal: prompt,
        userMessage: input,
        conversationHistory: recentMessages,
      };

      // ===================== AIType: Guiding Coach =====================
      if (AiType === 2) {
        // --- Case 1: Tour accepted ---
        if (stage === "Tour" && input.toLowerCase() === "yes") {
          const reply: Message = {
            role: "coach",
            content: `
            Great! Here’s a quick tour of the Ascend platform: \n
            MicroShifts Tab:
Welcome to the MicroShifts tab.
Here you’ll receive short, daily spiritual actions designed just for you.
You’ll see today’s MicroShift, such as “Take three deep breaths while focusing on release.”
You can mark it complete, log it in your journal, or discuss it with your AI coach.
You can also explore your past MicroShifts, filter them by type, or view your progress over time.
\n
SoulLog Tab:
This is your SoulLog, your personal journaling space.
You can write freely or use your voice to record your reflections.
You’ll receive helpful prompts based on your daily MicroShift, weekly themes, or your SoulPrint trends.
All your entries are safely saved with dates.
You can also send any entry to your AI coach for gentle guidance or reflection.
\n
Sound Temple Tab:
Welcome to the Sound Temple.
Here you can listen to personalized sound experiences that calm your mind and balance your energy.
Choose from grounding soundscapes, gratitude tones, or stillness meditations.
You can match sounds with your current MicroShift theme or set reminders for daily listening.
\n
Insights Tab:
This is your AI coach, your personal guide for spiritual insight.
You can chat with the coach to explore your thoughts, emotions, and patterns.
Ask questions like, “Why do I resist stillness?” or “How can I deepen today’s shift?”
The coach knows your SoulPrint, journal entries, and completed MicroShifts.
It responds with warmth, care, and wisdom to help you grow.
\n
My SoulPrint Tab:
Welcome to your SoulPrint profile.
Here you can see your spiritual balance across the eight keys.
Your growth is shown as a visual map, like a chart or ripple diagram.
You can review each key, explore related MicroShifts, and retake your SoulPrint every few weeks.
It helps you see your journey toward harmony and balance.
do you have any questions about these features? `,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            coachingType: "guidance",
          };

          setMessages((prev) => [...prev, reply]);
          speak(reply.content);
          setStage("Conversation");
          return; 
        }

        // --- Case 2: Tour declined ---
        else if (stage === "Tour" && input.toLowerCase() === "no") {
          const reply: Message = {
            role: "coach",
            content: `Alright! You can explore freely or ask me anything anytime.`,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            coachingType: "guidance",
          };

          setMessages((prev) => [...prev, reply]);
          setStage("Guide");
          speak(reply.content);
          return; 
        }

         else if (stage === "Conversation" && input.toLowerCase() === "yes") {
          const reply: Message = {
            role: "coach",
            content: `Alright! You can explore freely or ask me anything anytime.`,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            coachingType: "guidance",
          };

          setMessages((prev) => [...prev, reply]);
          setStage("Guide");
          speak(reply.content);
          return; 
        }


         else if (stage === "Conversation" && input.toLowerCase() === "no") {
          const reply: Message = {
            role: "coach",
            content: `Alright! You can explore freely or ask me anything anytime.`,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            coachingType: "guidance",
          };

          setMessages((prev) => [...prev, reply]);
          setStage("Guide");
          speak(reply.content);
          return; 
        }

        // --- Case 3: Normal conversation ---
        else {
          const { data: response, error } = await post(
            Api.GuidingCoach(),
            Payload
          );
          const reply: Message = {
            role: "coach",
            content: response?.data || error || "An error occurred",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            coachingType: "guidance",
          };
          setMessages((prev) => [...prev, reply]);
          speak(reply.content);
        }
      }

      // ===================== AIType: Ask Prompt =====================
      else  {
        const { data: response, error } = await post(
          Api.AskPromptToAi(),
          Payload
        );
        const reply: Message = {
          role: "coach",
          content: response?.data || error || "An error occurred",
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
        content:
          AiType === 2
            ? ` I'm AscendAI. Would you like me to give you a quick tour of the Ascend platform?`
            : `Hello! Today’s Soul Prompt invites you to ${prompt}.`,
        time:  new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        coachingType: "guidance",
      },
    ]);

  }, [prompt,AiType]);

useEffect(() => {
  if (isOpen && AiType === 2) {
    let isCancelled = false;

    const initializeSpeech = async () => {
      speechSynthesis.cancel();

      await new Promise(resolve => setTimeout(resolve, 200));

      if (isCancelled) return;

      await new Promise<void>((resolve) => {
        const voices = speechSynthesis.getVoices();
        if (voices.length) {
          resolve();
        } else {
          speechSynthesis.onvoiceschanged = () => resolve();
        }
      });

      if (isCancelled) return;

      await new Promise(resolve => setTimeout(resolve, 500));

      if (isCancelled) return;

      speak("Hi,  I'm AscendAI. Would you like me to give you a quick tour of the Ascend platform?");
    };

    initializeSpeech();

    return () => {
      isCancelled = true;
      speechSynthesis.cancel();
    };
  }
}, [isOpen, AiType]);

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

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl relative  ">
        {/* header */}
        <div className="bg-gradient-to-r from-[#8EA690] to-[#004236] rounded-t-2xl p-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold"> AI Guidance</h2>
            <p className="text-sm ">
              Personalized insights from your spiritual journey patterns
            </p>
            <p className="text-sm">{new Date().toDateString()}</p>
          </div>
          <button onClick={() =>{ setIsOpen(false); speak("")}}>
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
         {((stage === "Tour" || stage === "Conversation") && AiType === 2) && (
  <div className="w-full flex gap-4 justify-center items-center  my-3">
    <button
      className="px-2 py-1 bg-[#004236] text-white rounded-md"
      onClick={() => setInput("yes")}
    >
      Yes
    </button>
    <button
      className="px-2 py-1 bg-[#004236] text-white rounded-md"
      onClick={() => setInput("no")}
    >
      No
    </button>
  </div>
)}


          {/* Input area */}
          <div className="flex flex-col sm:flex-row gap-2 items-center p-4 border-t bg-white flex-shrink-0">
            <input
              type="text"
              className="flex-1 w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004236]"
              placeholder="Share what's on your mind or ask for guidance..."
              value={input}
              disabled={stage === "Tour" || stage === "Conversation" && AiType === 2}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            {!browserSupportsSpeechRecognition ||
              !supportedBrowsers.includes(browser) ? (
                <span className="text-red-500">
                  Your browser does not support speech recognition, please use a
                  supported browser.
                </span>
              ) : null}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleListening}
                className={`border flex gap-2 text-md font-semibold border-[#004236] px-4 py-2 rounded-md text-[#004236] 
                  hover:text-[#8EA690] items-center disabled:text-[#8EA690] disabled:cursor-not-allowed ${
                  isRecording ? "bg-[#8EA690]" : ""
                }`}
                disabled={stage === "Tour" || stage === "Conversation" && AiType === 2}
              >
                <FaMicrophone />{" "}
                {isRecording ? "Pause Listening" : "Start Voice"}
              </button>
              <button
                onClick={sendMessage}
                disabled={input === ""}
                className="bg-[#004236] hover:bg-[#8EA690] text-white px-6 py-2 rounded-md text-xl"
              >
                <IoIosSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AskToAi;
