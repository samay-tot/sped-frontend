import HttpClient from "../Utils/httpClient";
import API_CONFIG from "../config/api.config";

class AuthServices extends HttpClient {
  /**
   * API service for user login
   * @param data : an object containing user credentials
   * @returns : a promise that resolves to the response of the login request
   */
  login(data: { email: string; password: string }) {
    return this.http.post(API_CONFIG.login, data);
  }

  /**
   * API service for user registration
   * @param data : an object containing user details for account creation
   * @returns : a promise that resolves to the response of the registration request
   */

  signUp(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    zipCode: string;
    occupation: string;
    insurancePlans: string[] | null;
    country: string;
    state: string;
    city: string;
  }) {
    return this.http.post(API_CONFIG.signUp, data);
  }

  /**
   * API service for initiating the password recovery process
   * @param data : an object containing the user's email address
   * @returns : a promise that resolves to the response of the password recovery request
   */
  forgotPassWord(data: { email: string }) {
    return this.http.post(`${API_CONFIG.forgotPassword}`, data);
  }

  /**
   * API service for resetting the user's password
   * @param headerToken : authentication token to authorize the request
   * @param data : an object containing the new password
   * @returns : a promise that resolves to the response of the password reset request
   */
  resetPassword(headerToken: string, data: { password: string }) {
    return this.http.put(`${API_CONFIG.ResetPassword}`, data, {
      headers: { Authorization: `${headerToken}` },
    });
  }

  /**
   * API service for user authentication via social sign-in
   * @param data : an object containing user ID and social platform type
   * @returns : a promise that resolves to the response of the sign-in request
   */
  authSignIn(data:  {
    id: string
    email: string
    verified_email: boolean
    name: string
    socialType: string
  }) {
    return this.http.post(`${API_CONFIG.authSocialSignIn}`, data);
  }

  /**
   * API service for user logout
   * @param token : authentication token to invalidate the session
   * @returns : return response indicating success or failure of the logout process
   */
  logout(token: string | null) {
    return this.http.post(`${API_CONFIG.logout}`, { token });
  }

  /**
   * API service for All insurance list
   * @returns : return response
   */
  insuranceList() {
    return this.http.get(`${API_CONFIG.insurance}`);
  }

  /**
   * API service for All occupation list
   * @returns : return response
   */
  occupationList() {
    return this.http.get(`${API_CONFIG.occupation}`);
  }
}

export default new AuthServices();
