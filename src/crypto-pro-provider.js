export default class CryptoProProvider {
  constructor() {
    this.CADESCOM_CADES_BES = 1;
    this.CADESCOM_BASE64_TO_BINARY = 1;
    this.CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0;
    this.CADESCOM_HASH_ALGORITHM_CP_GOST_3411 = 100;
    this.NAVIGATOR = navigator;
  }

  getNavigator() {
    return this.NAVIGATOR;
  }
}
