 const GetDeepAnalysis =()=>{return `${import.meta.env.VITE_AWS_URL}/getDeepAnalysis`};

 const GetPersonalizedInsight =()=>{return `${import.meta.env.VITE_AWS_URL}/getPersonalizedInsight`};

 const GetEvolutionPath =()=>{return `${import.meta.env.VITE_AWS_URL}/getEvolutionForecast`};

 const GetSmartRecommendations =()=>{return `${import.meta.env.VITE_AWS_URL}/getSmartRecommendations`};

 const AskAiCoach =()=>{return `${import.meta.env.VITE_AWS_URL}/askSpiritualCoach`};

  export default {
    GetDeepAnalysis,
    GetPersonalizedInsight,
    GetEvolutionPath,
    GetSmartRecommendations,
    AskAiCoach,
  };