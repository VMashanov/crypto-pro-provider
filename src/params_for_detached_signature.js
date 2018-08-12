import {
  CreateObjectAsync,
  CADESCOM_HASH_ALGORITHM_CP_GOST_3411,
  CADESCOM_BASE64_TO_BINARY,
} from './constants';
import {
  hexToBase64,
  getTargetCertificate,
} from './utils';

/**
 * @function
 * @name paramsForDetachedSignature
 * @description Method calculate value of signature (Async)
 * @param {string} thumbprint - hash of certificate
 * @param {string} base64 - SignedInfo of signature template encoded to base64
 * @return {promise} signature value and certificate value
 */
const paramsForDetachedSignature = async (thumbprint, base64) => {
  const hashedData = await CreateObjectAsync('CAdESCOM.HashedData');

  await hashedData.propset_Algorithm(CADESCOM_HASH_ALGORITHM_CP_GOST_3411);
  await hashedData.propset_DataEncoding(CADESCOM_BASE64_TO_BINARY);
  await hashedData.Hash(base64);

  const calculatedHashedData = await hashedData;

  const certificate = await getTargetCertificate(thumbprint);

  const x509certificate = await certificate.Export(0);

  const rawSignature = await CreateObjectAsync('CAdESCOM.RawSignature');

  const signatureHex = await rawSignature.SignHash(
    calculatedHashedData,
    certificate,
  );

  return {
    signature_value: hexToBase64(signatureHex, '', signatureHex.length - 2),
    x509certificate,
  };
};

export default paramsForDetachedSignature;
