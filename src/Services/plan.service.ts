import HttpClient from "../Utils/httpClient";
import API_CONFIG from "../config/api.config";

class PlanServices extends HttpClient {
  /**
   * API service for get plan subscription details
   * @returns : return plan subscription details
   */
  getPlanSubscription() {
    return this.http.get(API_CONFIG.subscription);
  }

  /**
   * API service for all coupon code details
   * @param data : an object containing data
   * @returns : return all coupon list details
   */
  getCouponCodeList(
    currentPage: string | number,
    usersPerPage: string | number
  ) {
    return this.http.get(
      API_CONFIG.getCouponCode + `?page=${currentPage}&perPage=${usersPerPage}`
    );
  }

  /**
   * API service for stripe payment
   * @param data : an object containing data
   * @returns : return stripe url
   */
  addStripePayment(id: string) {
    return this.http.get(API_CONFIG.stripePayment + `?id=${id}`);
  }

  /**
   * API service for create coupon code
   * @param data : an object containing data
   * @returns : return coupon code
   */
  createCouponCode(data: { count: number | string; planId: string }) {
    return this.http.post(API_CONFIG.couponCreate, data);
  }

  /**
   * API service for coupon Code Deactivated
   * @param data : an object containing data
   * @returns : return response
   */
  couponCodeDeactivated(
    id: string,
    data: {
      isActive: boolean;
    }
  ) {
    return this.http.put(API_CONFIG.couponCodeDeactivated + `/${id}`, data);
  }
}

export default new PlanServices();
