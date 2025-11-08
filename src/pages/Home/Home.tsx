import Button from "../../components/Button/Button";
import {
  FaEye,
  FaHandshake,
  FaShieldAlt,
  FaClock,
  FaBalanceScale,
  FaHeart,
  FaStar,
  FaFile,
} from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import Features from "../../components/Feature/Features";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Frame1 from "../../assets/icons/Group1.svg";


function Home() {
  const naigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      naigate("/dashboard");
    }
  }, []);

  const keys = [
    {
      title: "Belief",
      icon: <FaStar className="text-[#2D7467]" />,
    },
    {
      title: "Gratitude",
      icon: <FaHeart className="text-[#2D7467]" />,
    },
    {
      title: "Perspective",
      icon: <FaEye className="text-[#2D7467]" />,
    },
    {
      title: "Compassion",
      icon: <FaHandshake className="text-[#2D7467]" />,
    },
    {
      title: "Resilience",
      icon: <FaShieldAlt className="text-[#2D7467]" />,
    },
    {
      title: "Time",
      icon: <FaClock className="text-[#2D7467]" />,
    },
    {
      title: "Purpose",
      icon: <GoGoal className="text-[#2D7467]" />,
    },
    {
      title: "Balance",
      icon: <FaBalanceScale className="text-[#2D7467]" />,
    },
  ];

  const infoCards = [
    {
      heading: "Expert Assignments",
      title: "Expert Assessment",
      desc: "Discover your spiritual strengths & growth area.",
    },
    {
      heading: "Export Spiritual Coaching",
      title: "Export Spiritual Coaching",
      desc: "Unlock deep insights into your spiritual strengths and uncover areas for growth and development.",
    },
    {
      heading: "Personal Wellness Tracking",
      title: "Personal Wellness Tracking",
      desc: "Track your spiritual progress and wellness with intuitive tools designed to help you stay on course.",
    },
    {
      heading: "Keys to Spiritual Transformation",
      title: "8 Keys to Spiritual Transformation",
      desc: "Explore the essential pillars of spiritual growth to cultivate a more balanced and fulfilling life.",
    },
  ];
  return (
    <div className="container   px-4 mx-auto ">
      <div className=" flex  w-full flex-col-reverse  lg:flex-row md:flex-row my-12  px-4 mt-[4rem] ">
        <div className="p-6 max-w-xl sm:mt-[3rem] sm:mt-[5.5rem] ">
          <h1 className="text-[1.5rem] sm:text-[2.5rem] font-bold leading-tight text-black mb-3">
            Your spiritual wellness
            <br />
            journey begins here
          </h1>
          <p className="font-semibold text-[1rem] sm:text-[1.25rem] mb-6">
            Connect with your authentic self and find inner
            <br />
            peace through AI-powered insights and personalized
            <br />
            guidance.
          </p>
          <Button
            className="bg-[#004236] text-white py-2 px-9 rounded-lg font-semibold mb-4"
            onClick={() => naigate("/login")}
            name="Start"
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src={Frame1} alt="Ascend Logo" className="mx-auto " />
        </div>
      </div>

      {/* spritual transformation */}
      <section className="text-center bg-[#004236] text-white mb-8 py-9 px-3">
        <h2 className="text-[1.8rem] sm:text-[2.18rem] font-semibold mb-2 font-poppins " >
          Keys to Spiritual Transformation
        </h2>
        <p className="mb-6 text-[1rem] sm:text-[1.1rem] font-poppins font-medium">
          Explore the essential pillars of spiritual growth to cultivate a <br />
          more balanced and fulfilling life.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-7 justify-items-center mx-[2rem]">
          {keys.map((key, index) => (
            <div
              className="flex flex-col items-center justify-center"
              key={index}
            >
              <div
                key={index}
                className="mb-1 w-12 h-[3.2rem] flex items-center justify-center bg-no-repeat bg-center bg-contain"
                style={{
                  backgroundImage: `url("/Rectangle.svg")`,
                }}
              >
                <div className="w-10 h-10 flex items-center justify-center text-2xl">
                  {key.icon}
                </div>
              </div>
              <div className="text-[0.8rem] sm:text-[1.02rem] font-semibold">{key.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-6 mb-8">
  {infoCards.map((card, idx) => (
    <div
      key={idx}
      className="flex flex-col gap-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-[#263238] max-sm:items-center max-sm:text-center"
    >
      <h3 className="font-poppins text-xl sm:text-2xl font-bold">{card.heading}</h3>

      <div className="flex items-start gap-4 max-sm:flex-col max-sm:items-center mt-2">
        <div className="bg-[#004236] text-white p-4 rounded-full text-xl mt-3">
          <FaFile />
        </div>

        <div className="flex flex-col justify-center max-sm:items-center ">
          <h4 className="font-bold font-poppins text-base font-poppins sm:text-lg">{card.heading}</h4>
          <p className="text-sm sm:text-base font-regular text-[#818181] mt-1">{card.desc}</p>
        </div>
      </div>
    </div>
  ))}
</section>



      {/* features */}
      <Features />
    </div>
  );
}

export default Home;
