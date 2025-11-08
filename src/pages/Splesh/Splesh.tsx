import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import star from "../../assets/icons/star.svg";
import spritual from "../../assets/icons/spritual.svg";
import ai from "../../assets/icons/ai.svg";
import personal from "../../assets/icons/personal.svg";
import Logo from "../../assets/icons/spleshLogo.png";
import Api from "../../services/Auth/Auth";
import useFetch from "../../hooks/useFetch";
import LayeredSpinner from "../../components/Loder/Loading";

function Splesh() {
  const navigate = useNavigate();

  const { data, isError, isLoading } = useFetch("user", Api.GetUser());

  useEffect(() => {
    const score = data?.data?.soulScore?.[0]?.totalScore;

    if (score > 0) {
      navigate("/dashboard");
    } else if (!score && data && !isError) {
    } else if (isError) {
      navigate("/login");
    }
  }, [data, isError, navigate]);

  if (isLoading) return <LayeredSpinner />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center mt-5">
      {/* Logo */}
      <div className="">
       <img src={Logo} alt="Ascend Logo" className="mx-auto max-w-[13.25rem] max-h-[13.25rem]" />
      </div>

      {/* Headline */}
      <div className="mb-4">
        <p className="text-[1.56rem] font-semibold text-gray-700">
          Your spiritual wellness journey begins here
        </p>
        <h2 className="text-[1.86rem] font-bold text-[#004236] [text-shadow:_3px_3px_2px_rgba(0,0,0,0.2)] mt-2">
          Discover Your Inner Peace
        </h2>
      </div>

      {/* Features box */}
      <div className="bg-gray-50 border border-gray-200 shadow-lg rounded-3xl p-4 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FeatureItem icon={star} title="8 Keys spiritual framework" />
        <FeatureItem icon={spritual} title="Expert spiritual coaching" />
        <FeatureItem icon={ai} title="AI-powered insights" />
        <FeatureItem icon={personal} title="Personal wellness tracking" />
      </div>

      {/* CTA Button */}
      <button
        className="bg-[#004236] hover:bg-[#004236] text-white text-[1rem] font-semibold px-8 py-3 rounded-full mb-4"
        onClick={() => navigate("/assessments")}
      >
        Begin Your Journey
      </button>

      {/* Footer Text */}
      <p className="text-[1rem] font-semibold text-[#263238]">
        Connect with your authentic self and unlock your spiritual potential
      </p>
    </div>
  );
}

function FeatureItem({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center  space-x-2 p-3">
      <div className="text-lg bg-white p-2 rounded-full shadow-lg">
        <img src={icon} alt={title} className="w-6 h-6" />
      </div>
      <span className=" text-[1rem] font-semibold text-[#00000]">{title}</span>
    </div>
  );
}

export default Splesh;
