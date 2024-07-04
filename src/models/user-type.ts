export type Subscription = {
  name: string;
  price: number;
  currency: string;
  proposalsLeft: number;
  templatesLeft: number;
  invitesLeft: number;
  adsLeft: number;
  hasAnalytics: boolean;
  hasEmailAlerts: boolean;
};

export type UserType = {
  id: string;
  email: string;
  password: string;
  mobile: string;
  username: string;
};
