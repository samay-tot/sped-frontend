import CryptoJs from "crypto-js";

export class CryptoService {
  private _crypto: typeof CryptoJs;

  constructor() {
    this._crypto = CryptoJs;
  }

  public async AES() {
    return this._crypto;
  }
}

export default new CryptoService();
