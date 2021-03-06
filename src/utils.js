import base64 from 'base-64';
import {
  cadesplugin,
  CAPICOM_CERTIFICATE_FIND_SHA1_HASH,
} from './constants';

/**
 * @function
 * @name convertStringToObj
 * @description Method convert string into object
 * @param {string} str - string for convert
 * @return {object} converted string
 */
export const convertStringToObj = str =>
  str.split(', ').reduce((result, subString) => {
    const partsOfSubString = subString.split('=');
    return { ...result, [partsOfSubString[0]]: partsOfSubString[1] };
  }, {});

/**
 * @function
 * @name hexToBase64
 * @description Method convert hex into base64
 * @param {string} hex - string for convert
 * @param {string} str - empty string
 * @param {string} index - start position of substring
 * @return {string} converted base64 string
 */
export const hexToBase64 = (hex, str = '', index = hex.length - 2) => {
  if (index >= 0) {
    return hexToBase64(
      hex,
      str + String.fromCharCode(parseInt(hex.substr(index, 2), 16)),
      index - 2,
    );
  }

  return base64.encode(str);
};

/**
 * @function
 * @name getTargetCertificate
 * @description Method returns certificate by thumbprint (Async)
 * @param {string} thumbprint - hash of certificate
 * @return {promise} certificate
 */
export const getTargetCertificate = async (thumbprint) => {
  const store = await cadesplugin.CreateObjectAsync('CAPICOM.Store');
  await store.Open();

  const certificatesObj = await store.Certificates;
  const certificates = await certificatesObj.Find(
    CAPICOM_CERTIFICATE_FIND_SHA1_HASH,
    thumbprint,
  );

  await store.Close();

  return certificates.Item(1);
};

/**
 * @function
 * @name injectToSignatureTemplate
 * @description Method returns XML with injected signature value
 *              and x509certificate
 * @param {string} xml - detached signature template
 * @param {string} signatureValue - signature value
 * @param {string} x509certificate = value of certificate
 * @return {string} transformed XML
 */
export const injectToSignatureTemplate = (
  xml,
  signatureValue,
  x509certificate,
) =>
  xml.replace(
    /<ds:SignatureValue>(.+)<\/ds:SignatureValue>/,
    `<ds:SignatureValue>${signatureValue}</ds:SignatureValue>`,
  ).replace(
    /<ds:X509Certificate>(.+)<\/ds:X509Certificate>/,
    `<ds:X509Certificate>${x509certificate}</ds:X509Certificate>`,
  );

/**
 * @function
 * @name extractAlgorithmOfCertificate
 * @description Method returns algorithm of certificate (Async)
 * @param {object} certificate - certificate
 * @return {promise} algorithm
 */
export const extractAlgorithmOfCertificate = async (certificate) => {
  const publicKey = await certificate.PublicKey();
  const algorithm = await publicKey.Algorithm;

  return algorithm.FriendlyName;
};
