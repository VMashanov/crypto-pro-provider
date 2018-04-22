import {
  cadesplugin,
  CADESCOM_HASH_ALGORITHM_CP_GOST_3411,
  CADESCOM_BASE64_TO_BINARY,
  CAPICOM_CERTIFICATE_FIND_SHA1_HASH,
} from './constants';
import { hexToBase64 } from './utils';

/**
 * @function
 * @name paramsForDetachedSignature
 * @description Method calculate value of signature
 * @param {string} thumbprint - hash of certificate
 * @param {string} base64 - SignedInfo of signature template encoded to base64
 * @return {promise} signature value and certificate value
 */
export const paramsForDetachedSignature = (thumbprint, base64) => {
  return new Promise((resolve, reject) => {
    try {
      const hashedData = cadesplugin.CreateObject('CAdESCOM.HashedData');

      hashedData.Algorithm = CADESCOM_HASH_ALGORITHM_CP_GOST_3411;
      hashedData.DataEncoding = CADESCOM_BASE64_TO_BINARY;

      const hashed_data = hashedData.Hash(base64);

      const store = cadesplugin.CreateObject('CAPICOM.Store');

      store.Open();

      const certificate = store.Certificates.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint).Item(1);

      const x509certificate = certificate.Export(0);

      const rawSignature = cadesplugin.CreateObject('CAdESCOM.RawSignature');

      const signatureHex = rawSignature.SignHash(hashed_data, certificate);

      store.Close();

      resolve({
        signature_value: hexToBase64(signatureHex, '', signatureHex.length - 2),
        x509certificate,
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @function
 * @name paramsForDetachedSignatureAsync
 * @description Method calculate value of signature (Async)
 * @param {string} thumbprint - hash of certificate
 * @param {string} base64 - SignedInfo of signature template encoded to base64
 * @return {promise} signature value and certificate value
 */
export const paramsForDetachedSignatureAsync = (thumbprint, base64) => {
  return new Promise((resolve, reject) => {
    cadesplugin.async_spawn(function *(args) {
      try {
        const hashedData = yield cadesplugin.CreateObjectAsync('CAdESCOM.HashedData');

        yield hashedData.propset_Algorithm(CADESCOM_HASH_ALGORITHM_CP_GOST_3411);
        yield hashedData.propset_DataEncoding(CADESCOM_BASE64_TO_BINARY);
        yield hashedData.Hash(args[1]);

        const hashed_data = yield hashedData;

        const store = yield cadesplugin.CreateObjectAsync('CAPICOM.Store');

        yield store.Open();


        const certificatesObj = yield store.Certificates;
        const certificates = yield certificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, args[0]);

        const certificate = yield certificates.Item(1);

        const x509certificate = yield certificate.Export(0);

        const rawSignature = yield cadesplugin.CreateObjectAsync('CAdESCOM.RawSignature');

        const signatureHex = yield rawSignature.SignHash(hashed_data, certificate);

        yield store.Close();

        args[2]({
          signature_value: hexToBase64(signatureHex, '', signatureHex.length - 2),
          x509certificate,
        });
      } catch (err) {
        args[3](cadesplugin.getLastError(err));
      }
    }, thumbprint, base64, resolve, reject);
  });
};
