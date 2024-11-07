export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const API_CONFIG = {
  // Auth
  login: `${BASE_URL}/auth/login`,
  signUp: `${BASE_URL}/auth/signup`,
  forgotPassword: `${BASE_URL}/auth/forgot_password`,
  ResetPassword: `${BASE_URL}/auth/reset_password`,
  authSocialSignIn: `${BASE_URL}/auth/providers/social_sign_in`,
  logout: `${BASE_URL}/auth/logout`,
  insurance: `${BASE_URL}/insurance/all`,
  occupation: `${BASE_URL}/occupations/all`,

  // Profile
  userFileUpload: `${BASE_URL}/user/file_upload`,
  userProfileDetails: `${BASE_URL}/user/get_profile`,
  updateUserProfileDetails: `${BASE_URL}/user/update_profile`,

  // Services
  addService: `${BASE_URL}/service/providers/add`,
  serviceList: `${BASE_URL}/service/providers/get_own_services`,
  updateService: `${BASE_URL}/service/providers/update`,
  deleteService: `${BASE_URL}/service/providers/delete`,

  // Plan Subscription
  subscription: `${BASE_URL}/subscription`,
  stripePayment: `${BASE_URL}/stripe/payment`,

  // Coupon Code
  couponCreate: `${BASE_URL}/coupon/create`,
  getCouponCode: `${BASE_URL}/coupon`,
  couponCodeDeactivated: `${BASE_URL}/coupon/deactivate`,

  // Providers
  getProviders: `${BASE_URL}/user/all_providers`,
  getSingleProviderData: `${BASE_URL}/user/get_provider_by_id`,

  // Rating
  addRating: `${BASE_URL}/rating/parents/add`,

  // Call
  userTrack: `${BASE_URL}/user/user_track`,
};

export default API_CONFIG;
