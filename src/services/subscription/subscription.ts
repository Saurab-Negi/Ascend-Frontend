const GetAllSubscriptions =  (): string => {return `${ import.meta.env.VITE_AWS_URL}/getPlans`};

const subscriptionaymentLink =  (): string => {return `${ import.meta.env.VITE_AWS_URL}/createCheckoutSession`};

const cancleSubscription =  (): string => {return `${ import.meta.env.VITE_AWS_URL}/cancelSubscription`};


export default {
    GetAllSubscriptions,
    subscriptionaymentLink,
    cancleSubscription

}