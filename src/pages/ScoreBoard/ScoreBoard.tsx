import  { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Api from "../../services/Auth/Auth"

const ScoreReveal = () => {
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  function onFinish() {
    // Navigate("/assessments");
  }
  const navigate = useNavigate();
  const {data} = useFetch("score", Api.UserSoulScore());
  const finalScore = data?.data[0]?.totalScore;


  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    let confettiPapers: any[] = [];
    let animationFrameId: number;

    class ConfettiPaper {
      x: number;
      y: number;
      r: number;
      d: number;
      color: string;
      tilt: number;
      tiltAngle: number;
      tiltAngleIncrement: number;

      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H - H;
        this.r = Math.random() * 15 + 5;
        this.d = Math.random() * 10 + 5;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
        this.tilt = Math.floor(Math.random() * 10) - 10;
        this.tiltAngle = 0;
        this.tiltAngleIncrement = (Math.random() * 0.07) + 0.05;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = this.r / 2;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
        ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
        ctx.stroke();
      }
    }

    for (let i = 0; i < 150; i++) {
      confettiPapers.push(new ConfettiPaper());
    }

    const update = () => {
      ctx!.clearRect(0, 0, W, H);
      for (let i = 0; i < confettiPapers.length; i++) {
        let p = confettiPapers[i];
        p.tiltAngle += p.tiltAngleIncrement;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;
        if (p.y > H) {
          p.y = -10;
          p.x = Math.random() * W;
        }
        p.draw(ctx!);
      }
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        if (prev >= finalScore) {
          clearInterval(interval);
          setCompleted(true);
          if (onFinish) onFinish();
          return finalScore;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [finalScore, onFinish]);
  

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const percentage = score / 100;
  const offset = circumference * (1 - percentage);

  return (
    <div className="relative flex flex-col justify-center items-center h-screen bg-gradient-to-br from-[#004236] to-indigo-700 text-white p-6 overflow-hidden">
      <canvas ref={confettiCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />

      {/* <img src={scoreImage} alt="Score Card" className="w-64 h-auto mb-6 z-10" /> */}

      <h2 className="text-2xl font-semibold mb-4 z-10">Revealing Your SoulPrint Score...</h2>

      <div className="relative w-64 h-64 flex items-center justify-center z-10">
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#ffffff30" strokeWidth="10" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#FFB747"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="none"
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
          />
        </svg>
        <div className="text-5xl font-extrabold animate-pulse z-10">{score}</div>
      </div>

      <div className="w-64 mt-6 h-2 bg-white/30 rounded-full overflow-hidden z-10">
        <div
          className="h-full bg-white transition-all duration-200"
          style={{ width: `${percentage * 100}%` }}
        />
      </div>

      {completed && (
        <div className="mt-6 text-xl font-semibold text-lime-300 transition-opacity duration-500 animate-fade-in z-10">
          Your SoulPrint Score is: <span className="font-bold text-white">{score}</span>
        </div>
      )}
      <button
        className="mt-6 bg-white text-indigo-700 py-2 px-4 rounded-full font-semibold hover:bg-indigo-700 hover:text-white transition-colors duration-200 z-10"
        onClick={() => navigate( `/dashboard?user=${true}`)}
      >
       Go To Dashboard
      </button>
    </div>
  );
};

export default ScoreReveal;


