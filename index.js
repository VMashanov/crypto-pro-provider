require('./vendor/cadesplugin_api');

/**
 * @class
 * @name CryptoProProvider
 * @description Module provide methods for signing requests with Crypto Pro
 * @author Vitaly Mashanov <vvmashanov@yandex.ru>
 */

const CryptoProProvider = () => {

  // provide access to cadesplugin_api
  const { cadesplugin } = window;

  /**
   * @function
   * @name isAsync
   * @description Checking, which method used by browser (Async or NPAPI)
   * @return {boolean}
   */
  const isAsync = () => (cadesplugin.CreateObjectAsync ? true : false);

  /**
   * @function
   * @name sign
   * @description Signing xml documents or files
   * @param {string} thumbprint - hash of certificate
   * @param {string} base64 - xml document or file encoded to base64
   * @return {promise} signature
   */
  const sign = (thumbprint, base64) => {
    return new Promise(function (resolve, reject) {
      try {
        const store = cadesplugin.CreateObject("CAPICOM.Store");
        store.Open();

        const certificate = store
                              .Certificates
                              .Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint)
                              .Item(1);

        const signer = cadesplugin.CreateObject("CAdESCOM.CPSigner");
        signer.Certificate = certificate;

        const signingTimeAttr = cadesplugin.CreateObject("CADESCOM.CPAttribute");
        signingTimeAttr.Name = CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME;
        signingTimeAttr.Value = _convertDate();

        signer.AuthenticatedAttributes2.Add(signingTimeAttr);


        const signedData = cadesplugin.CreateObject("CAdESCOM.CadesSignedData");
        signedData.ContentEncoding = CADESCOM_BASE64_TO_BINARY;
        signedData.Content = base64;

        try {
            const signature = signedData.SignCades(signer, CADESCOM_CADES_BES, true);
        } catch (err) {
            reject(cadesplugin.getLastError(err));
        }

        store.Close();

        resolve(signature);
      } catch (err) {
        reject(cadesplugin.getLastError(err));
      }
    });
  }

  /**
   * @function
   * @name signAsync
   * @description Signing xml documents or files (Async)
   * @param {string} thumbprint - hash of certificate
   * @param {string} base64 - xml document or file encoded to base64
   * @return {promise} signature
   */
  const signAsync = (thumbprint, base64) => {
    return new Promise(function (resolve, reject) {
      cadesplugin.async_spawn(function *(args) {
        try {
          const store = yield cadesplugin.CreateObjectAsync("CAPICOM.Store");
          yield store.Open();

          const certificatesObj = yield store.Certificates;
          const certificates = yield certificatesObj
                                        .Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, args[0]);

          const certificate = yield certificates.Item(1);

          const signer = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");

          // Атрибут времени
          const signingTimeAttr = yield cadesplugin.CreateObjectAsync("CADESCOM.CPAttribute");
          yield signingTimeAttr.propset_Name(cadesplugin.CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME);
          yield signingTimeAttr.propset_Value(_convertDate());
          const attr = yield signer.AuthenticatedAttributes2;
          yield attr.Add(signingTimeAttr);

          yield signer.propset_Certificate(certificate);

          const signedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
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
  }

  /**
   * @function
   * @name paramsForDetachedSignature
   * @description Method calculate value of signature
   * @param {string} thumbprint - hash of certificate
   * @param {string} base64 - SignedInfo of signature template encoded to base64
   * @return {promise} signature value and certificate value
   */
  const paramsForDetachedSignature = (thumbprint, base64) => {
    return new Promise(function (resolve, reject) {
      try {
        const hashedData = cadesplugin.CreateObject("CAdESCOM.HashedData");

        hashedData.Algorithm = CADESCOM_HASH_ALGORITHM_CP_GOST_3411;
        hashedData.DataEncoding = CADESCOM_BASE64_TO_BINARY;

        const hashed_data = hashedData.Hash(base64);

        const store = cadesplugin.CreateObject("CAPICOM.Store");

        store.Open();

        const certificate = store
                              .Certificates
                              .Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint)
                              .Item(1);

        const x509certificate = certificate.Export(0);

        const rawSignature = cadesplugin.CreateObject("CAdESCOM.RawSignature");

        const signatureHex = rawSignature.SignHash(hashed_data, certificate);

        store.Close();

        resolve({
          signature_value: _hexToBase64(signatureHex, '', signatureHex.length - 2),
          x509certificate: x509certificate
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * @function
   * @name paramsForDetachedSignatureAsync
   * @description Method calculate value of signature (Async)
   * @param {string} thumbprint - hash of certificate
   * @param {string} base64 - SignedInfo of signature template encoded to base64
   * @return {promise} signature value and certificate value
   */
  const paramsForDetachedSignatureAsync = (thumbprint, base64) => {
    return new Promise((resolve, reject) => {
      cadesplugin.async_spawn(function *(args) {
        try {
          const hashedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.HashedData");

          yield hashedData.propset_Algorithm(CADESCOM_HASH_ALGORITHM_CP_GOST_3411);
          yield hashedData.propset_DataEncoding(CADESCOM_BASE64_TO_BINARY);
          yield hashedData.Hash(args[1]);

          const hashed_data = yield hashedData;

          const store = yield cadesplugin.CreateObjectAsync("CAPICOM.Store");

          yield store.Open();


          const certificatesObj = yield store.Certificates;
          const certificates = yield certificatesObj
                                       .Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, args[0]);

          const certificate = yield certificates.Item(1);

          const x509certificate = yield certificate.Export(0);

          const rawSignature = yield cadesplugin.CreateObjectAsync("CAdESCOM.RawSignature");

          const signatureHex = yield rawSignature.SignHash(hashed_data, certificate);

          yield store.Close();

          args[2]({
            signature_value: _hexToBase64(signatureHex, '', signatureHex.length - 2),
            x509certificate: x509certificate
          });
        } catch (err) {
          args[3](cadesplugin.getLastError(err));
        }
      }, thumbprint, base64, resolve, reject);
    });
  }

  /**
   * @function
   * @name _convertStringToObj
   * @description Method convert string into object
   * @param {string} str - string for convert
   * @return {object} converted string
   */
  const _convertStringToObj = (str) => {
    const obj = new Object();

    str.split(', ').map(el => {
      obj[el.split('=')[0]] = el.split('=')[1]
    })

    return obj;
  }

  /**
   * @function
   * @name _hexToBase64
   * @description Method convert hex into base64
   * @param {string} hex - string for convert
   * @param {string} str - empty string
   * @param {string} index - start position of substring
   * @return {string} converted base64 string
   */
  const _hexToBase64 = (hex, str, index) => {
    if (index >= 0) {
      return _hexToBase64(
        hex,
        str + String.fromCharCode(parseInt(hex.substr(index, 2), 16)),
        index - 2
      )
    }

    return window.btoa(str);
  }

  /**
   * @function
   * @name digestValue
   * @description Method returns checksum of data that transmitted in the
   parameters
   * @param {string} hashedData - string for checksum calculating
   * @return {string} checksum of data
   */
  const digestValue = (hashedData) => {
    const oHashedData = cadesplugin.CreateObject('CAdESCOM.HashedData');

    oHashedData.Algorithm = CADESCOM_HASH_ALGORITHM_CP_GOST_3411;
    oHashedData.DataEncoding = CADESCOM_BASE64_TO_BINARY;
    oHashedData.Hash(hashedData);

    return oHashedData.Value;
  }

  /**
   * @function
   * @name digestValueAsync
   * @description Method returns promise with checksum of data that
   * transmitted in the parameters
   * @param {string} hashedData - string for checksum calculating
   * @return {string} checksum of data
   */
  const digestValueAsync = (hashedData) => {
    return new Promise((resolve, reject) => {
      cadesplugin.async_spawn(function *(args) {
        try {
          const oHashedData = yield cadesplugin.CreateObjectAsync('CAdESCOM.HashedData');

          yield oHashedData.propset_Algorithm(CADESCOM_HASH_ALGORITHM_CP_GOST_3411);
          yield oHashedData.propset_DataEncoding(CADESCOM_BASE64_TO_BINARY);
          yield oHashedData.Hash(args[0]);

          const sHashValue = yield oHashedData.Value

          args[1](sHashValue);
        } catch (err) {
          args[2](cadesplugin.getLastError(err));
        }
      }, hashedData, resolve, reject)
    })
  }

  /**
   * @function
   * @name _convertDate
   * @description Method returns date
   * @return {string} date
   */
  const _convertDate = () => {
    const date = new Date();
    const navigator_name = navigator.appName;
    return navigator_name == 'Microsoft Internet Explorer' ? date.getVarDate() : date
  }

  return {
    certificates: isAsync() ? certificatesAsync : certificates,
    sign: isAsync() ? signAsync : sign,
    paramsForDetachedSignature: isAsync() ? paramsForDetachedSignatureAsync : paramsForDetachedSignature,
    digestValue: isAsync() ? digestValueAsync : digestValue,
  }
}

module.exports = CryptoProProvider();
