import HttpClient from "../Utils/httpClient";
import API_CONFIG from "../config/api.config";

class UserServices extends HttpClient {
  /**
   * API service for user profile photo
   * @param data : an object containing user profile photo
   * @returns : return response
   */
  fileUpload(profilePhoto: string) {
    return this.http.post(API_CONFIG.userFileUpload, profilePhoto);
  }

  /**
   * API service for user profile details
   * @returns : return user profile details
   */
  getUserProfileDetails() {
    return this.http.get(API_CONFIG.userProfileDetails);
  }

  /**
   * API service for update user profile details
   * @param data : an object containing updated user profile details
   * @returns : return updated profile details
   */
  updateUserProfileDetails(data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    zipCode?: string;
    insurancePlans?: string;
    bio?: string;
    avatar?: string | null;
    country?: string;
    state?: string;
    city?: string;
  }) {
    return this.http.put(API_CONFIG.updateUserProfileDetails, data);
  }
}

export default new UserServices();
