const GetUser =()=>{return `${import.meta.env.VITE_AWS_URL}/currentUser`};

const CreateUser =()=>{return `${import.meta.env.VITE_AWS_URL}/createUser`};

const UserSoulScore =()=>{return `${import.meta.env.VITE_AWS_URL}/getUserSoulScore`};

const UserRecommendation =()=>{return `${import.meta.env.VITE_AWS_URL}/recommendedRitual`};

const EditUser =()=>{return `${import.meta.env.VITE_AWS_URL}/editUser`};

const GenratePSUrl=(): string =>{ return `${ import.meta.env.VITE_AWS_URL}/generatePresignedUrl`};

export default {
    GetUser,
    CreateUser,
    UserSoulScore,
    UserRecommendation,
    EditUser,
    GenratePSUrl,
};