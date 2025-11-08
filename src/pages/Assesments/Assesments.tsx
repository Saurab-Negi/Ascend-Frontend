import { useEffect, useState } from "react";
import { FaBullseye } from "react-icons/fa";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import Api from "../../services/Assesments/Assesments";
import Api2 from "../../services/StKey/StKey";
import useFetch from "../../hooks/useFetch";
import usePost from "../../hooks/usePost";
import LayeredSpinner from "../../components/Loder/Loading";
import { useQueryClient } from "@tanstack/react-query";

type QuestionItem = {
  question: string;
  id: string;
  stKeyName: string;
};

type QuestionGroup = {
  stKeyId: string;
  questions: QuestionItem[];
};
type AnswerItem = {
  question: string;
  answer: number;
  stkeyName: string;
};

function Assesments() {
  const [currentPage, setCurrentPage] = useState(0);
  const [Error, setError] = useState<string >("");
  const [loding, setLoading] = useState<boolean>(false);
  const [AllQuestion, setAllQuestion] = useState<QuestionGroup[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: AnswerItem[] }>({});

  const navigate = useNavigate();

  const { data } = useFetch("questions", Api.GetQuestions());
  const { data :key } = useFetch("key", Api2.GetKeys());
  const {post} = usePost();
  const initialAnswers: { [key: string]: AnswerItem[] } = {};

  const queryClient = useQueryClient();

  useEffect(() => {
    if (data?.data) {
      setAllQuestion(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (data?.data) {
     data.data.forEach((group: QuestionGroup) => {
  if (!answers[group.stKeyId]) {
    initialAnswers[group.stKeyId] = group.questions.map((q) => ({
      question: q.question,
      stkeyName: q.stKeyName,
      answer: 0,
    }));
  }
});

setAnswers((prev) => ({ ...initialAnswers, ...prev }));
    }
  }, [data]);

  const currentGroup = AllQuestion[currentPage];

  const totalQuestions = Object.values(answers).reduce(
    (sum, groupAnswers) => sum + groupAnswers.length,
    0
  );

  const answeredQuestions = Object.values(answers).reduce(
    (sum, groupAnswers) => sum + groupAnswers.filter((ans) => ans.answer !== 0).length,
    0
  );


  let progess = ((currentPage + 1) / AllQuestion.length) * 100;

  const previous = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const next = async() => {
    const currentAnswers = answers[currentKeyName] || [];

  const allAnswered = currentAnswers.length === currentGroup?.questions.length &&
                      currentAnswers.every((ans) => ans.answer !== 0);

  if (!allAnswered) {
    setError("Please answer all questions before proceeding.");
    return;
  }
    if (currentPage < AllQuestion.length - 1) {
       window.scrollTo({ top: 0, behavior: "smooth" })
      setCurrentPage(currentPage + 1);
    } else {
       setLoading(true);
        await post(Api.SubmitQuestion(), {
        assessment: answers,
      });
      queryClient.invalidateQueries({queryKey :["user"]});
      setLoading(false);
      navigate("/score");
      setAnswers({});
    }
    setError("");
  };

  const currentKeyName = currentGroup?.stKeyId;
 const handleAnswer = (index: number, value: number) => {
  const questionId = currentGroup?.questions[index]?.question;
  const keyName = currentGroup?.questions[index]?.stKeyName;
  if (!questionId || !currentKeyName) return;

  setAnswers((prev) => {
    const groupAnswers = [...(prev[currentKeyName] || [])];
    groupAnswers[index] = { question: questionId, answer: value, stkeyName: keyName };
    return { ...prev, [currentKeyName]: groupAnswers };
  });
};


  return (
    <>
     { loding ? <LayeredSpinner /> :
      (<div className="max-w-2xl mx-auto mt-[2rem] p-4 space-y-6 text-black  rounded-lg my-5">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-[1.2rem] sm:text-[1.5rem]  font-semibold flex items-center justify-center gap-2">
            <span>
              <FaBullseye />
            </span>{" "}
            8 Keys Spiritual Assessment
          </h2>
          <p className="text-[1rem] font-semibold">
            Discover your spiritual strengths and growth areas
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-[#263238] text-[0.8rem] sm:text-[1.1rem] font-semibold mb-1">
            <span>Progress: {currentPage + 1} of 8 Keys</span>
            <span className=" font-medium">
              {Math.floor(progess)}% Complete
            </span>
          </div>
          <div className="w-full bg-[#DFDFDF] h-2 rounded-full">
            <div
              className="h-full bg-[#004236] rounded-full"
              style={{ width: `${progess}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between font-semibold text-black">
          <h3 className="text-[1.5rem] ">
            {key?.data?.find((k:any)=> k.id === currentGroup?.stKeyId)?.name}
          </h3>
          <div className="text-right text-[1rem] ">
            Subtotal: {answeredQuestions} /{totalQuestions}
          </div>
          </div>
          <p className="text-base font-[0.5rem] sm:font-[1.2rem] font-inter  mt-1">
            Cultivating an unwavering conviction in yourself, in growth, and in
            possibility even under uncertainty or setback.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-[#F1F1F1]  pt-3 rounded-md text-sm">
          <div className="px-4 font-inter text-[0.7rem] sm:text-[1rem]">
            <strong className="font-bold text-[0.9rem] sm:text-[1rem]">Instructions:</strong> <br />
            Rate each statement on a scale from 1 to 5:
          </div>

          <div className="bg-[#CFD8D0]  text-black text-[0.8rem] font-semibold p-2 rounded-md mt-2">
            <p>
              1 = Strongly Disagree | 2 = Disagree | 3 = Neutral | 4 = Agree | 5
              = Strongly Agree{" "}
            </p>
          </div>
        </div>
 
        {/* Questions */}
        <div className="space-y-5">
          {currentGroup?.questions.map((q, index) => (
            <div
              key={index}
              className="border border-1 border-gray-200 rounded-xl p-4 shadow-lg"
            >
              <p className="text-[0.8rem] sm:text-[1.1rem] font-poppins font-medium text-black mb-2">
                {index + 1}. {q.question}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-2">
                {[1, 2, 3, 4, 5].map((qus) => {
                  return (
                    <button
                      key={qus}
                      className={`py-1 px-[1rem] sm:py-2 sm:px-[2rem] border rounded-lg text-sm hover:bg-[#004236] hover:text-white transition ${
                        answers[currentKeyName]?.[index]?.answer === qus
                          ? "bg-[#004236] text-white"
                          : "bg-[#DFDFDF]"
                      }`}
                      onClick={() => handleAnswer(index, qus)}
                    >
                      {qus}
                    </button>
                  );
                })}
              </div>
              <div className="flex text-base justify-between px-3 py-1 text-[0.6rem] sm:text-[0.8rem] lg:text-sm md:text-sm text-white rounded-lg  bg-gradient-to-r from-[#8EA690]  to-[#004236] ">
                <span className=" font-semibold">Strongly Disagree</span>
                <span className=" font-semibold">Strongly Agree</span>
              </div>
            </div>
          ))}
        </div>
        {/* Error Message */}
        {Error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mt-4 font-semibold">
            <p className="text-sm">{Error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex font-poppins text-[0.8rem] sm: text-[1rem] font-medium justify-between pt-6">
          <Button
            name="Previous"
            onClick={() => previous()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            children={
              <div className="w-6 h-6 flex items-center justify-center bg-black text-white text-center rounded-full">
                <span className="text-2xl mb-2">{"\u2039"}</span>
              </div>
            }
          />

          <button
            className={
              "flex items-center gap-2 px-4 py-2 bg-[#004236] rounded-lg hover:bg-[#8EA690]"
            }
            onClick={() => next()}
          >
            <span className="text-white font-medium text-sm">Next</span>
            <div className="w-6 h-6 flex items-center justify-center bg-white text-[#004236] text-center rounded-full">
              <span className="text-2xl mb-2">{"\u203A"}</span>
            </div>
          </button>
        </div>
      </div>)
      }
    </>
  );
}

export default Assesments;
