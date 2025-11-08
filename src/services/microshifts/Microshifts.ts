 
 const getDailyMicroshifts = () => {return `${import.meta.env.VITE_AWS_URL}/getDailyMicroshift`};

 const MarkAsDoneMicroshifts = () => {return `${import.meta.env.VITE_AWS_URL}/attemptMicroshift`};

 const DisscussMicroshiftsWithAi = () => {return `${import.meta.env.VITE_AWS_URL}/discussMicroShiftWithAI`};

 const GetAllMicroshifts = (stKeyName? : string, lastKey? : string) => {return `${import.meta.env.VITE_AWS_URL}/getAllMicroShifts?stKeyName=${stKeyName || ""}&limit=10&lastKey=${lastKey || ""}`};

const MicroShiftsHistory = (lastKey? : string ) => {return `${import.meta.env.VITE_AWS_URL}/getCompletedMicroShifts?limit=10&lastKey=${lastKey || ""}`};

 export default {
     getDailyMicroshifts,
     MarkAsDoneMicroshifts,
     MicroShiftsHistory,
     DisscussMicroshiftsWithAi,
     GetAllMicroshifts,
 }