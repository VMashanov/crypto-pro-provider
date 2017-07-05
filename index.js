require('./vendor/cadesplugin_api');

/**
 * @description Module provide methods for signing requests with Crypto Pro
 * @author Vitaly Mashanov <vvmashanov@yandex.ru>
 */

const CryptoProProvider = () => {

  // signature type CAdES BES
  const CADESCOM_CADES_BES = 1;

  // data will reencoded from base64 into binary array
  const CADESCOM_BASE64_TO_BINARY = 1;

  // finding certificates by SHA1 hash
  const CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0;

  // algorithm GOST R 34.11-94.
  const CADESCOM_HASH_ALGORITHM_CP_GOST_3411 = 100;

  // provide access to cadesplugin_api
  const cadesplugin = window.cadesplugin;

  /**
   * @description Checking, which method used by browser (Async or NPAPI)
   * @return {boolean}
   */
  const isAsync = () => {
    return cadesplugin.CreateObjectAsync ? true : false
  }

  /**
   * @description Provides access to loaded certificates for browser
   * @return {array} list of certificates
   */
  const certificates = () => {
    // TODO
  }

  /**
   * @description Provides access to loaded certificates for browser (Async)
   * @return {array} list of certificates
   */
  const certificatesAsync = () => {
    // TODO
  }

  /**
   * @description Signing xml documents or files
   * @param {string} thumbprint - hash of certificate
   * @param {string} base64 - xml document or file encoded to base64
   * @return {promise} signature
   */
  const sign = (thumbprint, base64) => {
    // TODO
  }

  /**
   * @description Signing xml documents or files (Async)
   * @param {string} thumbprint - hash of certificate
   * @param {string} base64 - xml document or file encoded to base64
   * @return {promise} signature
   */
  const signAsync = (thumbprint, base64) => {
    // TODO
  }

  /**
   * @description Method calculate value of signature
   * @param {string} thumbprint - hash of certificate
   * @param {string} base64 - SignedInfo of signature template encoded to base64
   * @return {promise} signature value and certificate value
   */
  const paramsForDetachedSignature = (thumbprint, base64) => {
    // TODO
  }

  /**
   * @description Method calculate value of signature (Async)
   * @param {string} thumbprint - hash of certificate
   * @param {string} base64 - SignedInfo of signature template encoded to base64
   * @return {promise} signature value and certificate value
   */
  const paramsForDetachedSignatureAsync = (thumbprint, base64) => {
    // TODO
  }

  return {
    certificates: isAsync() ? certificatesAsync : certificates,
    sign: isAsync() ? signAsync : sign,
    paramsForDetachedSignature: isAsync() ? paramsForDetachedSignatureAsync : paramsForDetachedSignature
  }
}

module.exports = CryptoProProvider();
