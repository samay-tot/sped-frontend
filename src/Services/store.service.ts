import { CryptoService } from "./crypto.service";

class StoreService extends CryptoService {
  public async logout() {
    await localStorage.removeItem("persist:root");
    await localStorage.clear();
    window.location.href = "/login";
  }
}

const storeService = new StoreService();
export default storeService;
