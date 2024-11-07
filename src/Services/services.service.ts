import HttpClient from "../Utils/httpClient";
import API_CONFIG from "../config/api.config";

class ServiceServices extends HttpClient {
  /**
   * API service for add service data
   * @param data : an object containing service details
   * @returns : return response
   */
  addServices(data: { name: string; description: string; rate: string }) {
    return this.http.post(API_CONFIG.addService, data);
  }

  /**
   * API service for all service details
   * @param data : an object containing data
   * @returns : return all service details
   */
  getProviderService(
    currentPage: string | number,
    usersPerPage: string | number,
    search: string
  ) {
    return this.http.get(
      API_CONFIG.serviceList +
        `?page=${currentPage}&perPage=${usersPerPage}&search=${search}`
    );
  }

  /**
   * API service for update service details
   * @param data : an object containing user id and updated service details
   * @returns : return updated service details
   */
  updateServiceDetails(
    id: string,
    data: { name: string; description: string; rate: string }
  ) {
    return this.http.put(`${API_CONFIG.updateService}/${id}`, data);
  }

  /**
   * API service for delete service
   * @param  data: delete the service data
   * @returns : return response
   */

  deleteServiceDetails(id: string) {
    return this.http.put(`${API_CONFIG.deleteService}/${id}`);
  }
}

export default new ServiceServices();
