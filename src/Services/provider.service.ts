import HttpClient from "../Utils/httpClient";
import API_CONFIG from "../config/api.config";

class ProviderServices extends HttpClient {
  /**
   * API service for all provider details
   * @param data : an object containing data
   * @returns : return all provider details
   */
  getAllProviderList(
    currentPage: string | number,
    usersPerPage: string | number,
    search: string,
    ratingRange: string,
    insurance: string,
    token: string
  ) {
    return this.http.get(
      API_CONFIG.getProviders +
        `?page=${currentPage}&perPage=${usersPerPage}&search=${search}&ratingRange=${ratingRange}&insurance=${insurance}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  }

  /**
   * API service for get provider details
   * @param data : an object containing user id
   * @returns : return provider details
   */
  getProviderData(id: string, token: string | null) {
    return this.http.get(`${API_CONFIG.getSingleProviderData}/${id}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
  }

  /**
   * API service for add the rating
   * @param data : an object containing the rating data
   * @returns : return response
   */
  addRatingData(
    data: {
      providerId: string;
      rate: number;
      description: string;
    },
    token: string | null
  ) {
    return this.http.post(`${API_CONFIG.addRating}`, data, {
      headers: {
        Authorization: `${token}`,
      },
    });
  }

  /**
   * API service for add the rating
   * @param data : an object containing the id and type
   * @returns : return response
   */
  UserTrackData(id: string, type: string, token: string | null) {
    return this.http.put(
      `${API_CONFIG.userTrack}/${id}`,
      {
        type: type,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  }
}

export default new ProviderServices();
