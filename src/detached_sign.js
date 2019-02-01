import base64Lib from 'base-64';
import {
  cadesplugin,
  ALGORITHMS,
  CADESCOM_BASE64_TO_BINARY,
} from './constants';
import {
  hexToBase64,
  getTargetCertificate,
  injectToSignatureTemplate,
  extractAlgorithmOfCertificate,
} from './utils';

/**
 * @function
 * @name detachedSign
 * @description Method calculate value of signature (Async)
 * @param {string} thumbprint - hash of certificate
 * @param {string} base64 - SignedInfo of signature template encoded to base64
 * @return {promise} signature value and certificate value
 */
const detachedSign = async (
  thumbprint,
  base64,
  signatureTemplateAsBase64,
) => {
  const hashedData = await cadesplugin.CreateObjectAsync('CAdESCOM.HashedData');
  const certificate = await getTargetCertificate(thumbprint);

  const algorithm = await extractAlgorithmOfCertificate(certificate);

  await hashedData.propset_Algorithm(ALGORITHMS[algorithm]);
  await hashedData.propset_DataEncoding(CADESCOM_BASE64_TO_BINARY);
  await hashedData.Hash(base64);

  const calculatedHashedData = await hashedData;

  const x509certificate = await certificate.Export(0);

  const rawSignature = await cadesplugin.CreateObjectAsync('CAdESCOM.RawSignature');

  const signatureHex = await rawSignature.SignHash(
    calculatedHashedData,
    certificate,
  );

  const transformedSignatureTemlate = injectToSignatureTemplate(
    base64Lib.decode(signatureTemplateAsBase64),
    hexToBase64(signatureHex),
    x509certificate,
  );

  return base64Lib.encode(transformedSignatureTemlate);
};

export default detachedSign;
