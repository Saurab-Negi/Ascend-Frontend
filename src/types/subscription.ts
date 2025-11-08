type Benefit = {
  name: string;
  endpoint: string;
};
export interface SubscriptionPlan {
  id: string;
  planType: string;
  planPrice: number;
  planDuration: number;
  planDescription: string[];
  planColor: string;
  planIcon: string; 
  services: Benefit[];
}