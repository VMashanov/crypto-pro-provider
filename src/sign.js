import {
  CreateObjectAsync,
  CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME,
  CADESCOM_BASE64_TO_BINARY,
  CADESCOM_CADES_BES,
} from './constants';
import {
  convertDate,
  getTargetCertificate,
} from './utils';

/**
 * @function
 * @name sign
 * @description Signing xml documents or files (Async)
 * @param {string} thumbprint - hash of certificate
 * @param {string} base64 - xml document or file encoded to base64
 * @return {promise} signature
 */
const sign = async (thumbprint, base64) => {
  const certificate = await getTargetCertificate(thumbprint);
  const signer = await CreateObjectAsync('CAdESCOM.CPSigner');

  // Атрибут времени
  const signingTimeAttr = await CreateObjectAsync('CADESCOM.CPAttribute');
  await signingTimeAttr.propset_Name(CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME);
  await signingTimeAttr.propset_Value(convertDate(navigator.appName));
  const attr = await signer.AuthenticatedAttributes2;
  await attr.Add(signingTimeAttr);

  await signer.propset_Certificate(certificate);

  const signedData = await CreateObjectAsync('CAdESCOM.CadesSignedData');
  await signedData.propset_ContentEncoding(CADESCOM_BASE64_TO_BINARY);
  await signedData.propset_Content(base64);

  return signedData.SignCades(signer, CADESCOM_CADES_BES, true);
};

export default sign;
