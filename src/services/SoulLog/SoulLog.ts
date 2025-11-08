
const GetPrompt=():string=>{return `${import.meta.env.VITE_AWS_URL}/getDailyPrompt`};

const AnswerPrompt=():string=>{return `${import.meta.env.VITE_AWS_URL}/answerPrompt`};

const AskPromptToAi=():string=>{return `${import.meta.env.VITE_AWS_URL}/discussPromptWithAI`};

const GuidingCoach=():string=>{return `${import.meta.env.VITE_AWS_URL}/GuidingCoach`};

const PromptHistory=(lastKey?:string):string=>{return `${import.meta.env.VITE_AWS_URL}/getCompletedPrompts?limit=10&lastKey=${lastKey}`};

export default{
    AnswerPrompt,
    GetPrompt,
    AskPromptToAi,
    PromptHistory,
    GuidingCoach
};