const GetQuestions = () => {return `${import.meta.env.VITE_AWS_URL}/getQsnsForUser`};
const SubmitQuestion = () => {return `${import.meta.env.VITE_AWS_URL}/attemptStKeyAss`};





export default {
    GetQuestions,
    SubmitQuestion,
};