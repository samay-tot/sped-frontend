import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import storeService from "../Services/store.service";

abstract class HttpClient {
  protected readonly http: AxiosInstance;

  public constructor() {
    this.http = axios.create({ baseURL: '' });
    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  private requestmodifier = async (config: any) => {
    const { url } = config;
    if (!url.includes("login")) {
      const token = await localStorage.getItem("token");
      config.headers["Authorization"] =
        config?.headers?.Authorization || token || "";
    }
    return config;
  };

  private _initializeRequestInterceptor = () => {
    this.http.interceptors.request.use(async (config) =>
      this.requestmodifier(config)
    );
    axios.interceptors.request.use(async (config) =>
      this.requestmodifier(config)
    );
  };

  private _initializeResponseInterceptor = () => {
    this.http.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
    axios.interceptors.response.use(
      (response) => response,
      (error) => this._handleError(error)
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;

  protected _handleError = (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        storeService.logout();
      }
    }
    return Promise.reject(error);
  };
}

export default HttpClient;
