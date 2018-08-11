import {
  cadesplugin,
  CAPICOM_CERTIFICATE_FIND_SHA1_HASH,
  CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME,
  CADESCOM_BASE64_TO_BINARY,
  CADESCOM_CADES_BES,
} from './constants';
import { convertDate } from './utils';

/**
 * @function
 * @name sign
 * @description Signing xml documents or files (Async)
 * @param {string} thumbprint - hash of certificate
 * @param {string} base64 - xml document or file encoded to base64
 * @return {promise} signature
 */
const sign = (thumbprint, base64) => {
  return new Promise((resolve, reject) => {
    cadesplugin.async_spawn(function *(args) {
      try {
        const store = yield cadesplugin.CreateObjectAsync('CAPICOM.Store');
        yield store.Open();

        const certificatesObj = yield store.Certificates;
        const certificates = yield certificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, args[0]);

        const certificate = yield certificates.Item(1);

        const signer = yield cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner');

        // Атрибут времени
        const signingTimeAttr = yield cadesplugin.CreateObjectAsync('CADESCOM.CPAttribute');
        yield signingTimeAttr.propset_Name(cadesplugin.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME);
        yield signingTimeAttr.propset_Value(convertDate(navigator.appName));
        const attr = yield signer.AuthenticatedAttributes2;
        yield attr.Add(signingTimeAttr);

        yield signer.propset_Certificate(certificate);

        const signedData = yield cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData');
        yield signedData.propset_ContentEncoding(CADESCOM_BASE64_TO_BINARY);
        yield signedData.propset_Content(args[1]);

        const signature = yield signedData.SignCades(signer, CADESCOM_CADES_BES, true);

        yield store.Close();

        args[2](signature);
      } catch (err) {
        args[3](cadesplugin.getLastError(err));
      }
    }, thumbprint, base64, resolve, reject);
  });
};

export default sign;
