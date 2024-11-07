export interface AuthState {
  LoginDetails: LoginDetails;
  headerTitle: string;
  userActivePlan: UserActivePlan;
  themeColorMode: string;
  providerId: string;
}

export interface LoginDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: {
    value: string
    label: string
  };
  state: {
    value: string
    label: string
  };
  city: {
    value: string
    label: string
  };
  zipCode: string;
  occupation: string;
  insurancePlans: string[];
  role: string;
  isDeleted: boolean;
  isSubscribed: boolean;
  token: string;
  avatar: string;
}

export interface UserActivePlan {
  _id: string;
  name: string;
  type: string;
  price: string;
  isActivePlan: boolean;
}
