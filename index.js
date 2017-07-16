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
    return new Promise((resolve, reject) => {
      const certificates_array = new Array();

      try {
        const store = cadesplugin.CreateObject("CAPICOM.Store");
        store.Open();

        const certificates = store.Certificates;
        const count = certificates.Count;

        for (let i = 1; i <= count; i++) {
          try {
            const certificate = certificates.Item(i);
            const is_valid = certificate.IsValid();

            certificates_array.push({
              issuer_name: _convertStringToObj(certificate.IssuerName),
              serial_number: certificate.SerialNumber,
              subject_name: _convertStringToObj(certificate.SubjectName),
              thumbprint: certificate.Thumbprint,
              Valid_from_date: certificate.ValidFromDate,
              Valid_to_date: certificate.ValidToDate,
              is_valid: is_valid.Result,
              version: certificate.Version
            });
          } catch(err) {
            console.error(err);
          }
        }

        store.Close();

        resolve(certificates_array);
      } catch (err) {
        reject(cadesplugin.getLastError(err));
      }
    });
  }

  /**
   * @description Provides access to loaded certificates for browser (Async)
   * @return {array} list of certificates
   */
  const certificatesAsync = () => {
    return new Promise((resolve, reject) => {
      cadesplugin.async_spawn(function *(args) {
        const certificates_array = new Array();

        try {
          const store = yield cadesplugin.CreateObjectAsync("CAPICOM.Store");
          yield store.Open();

          const certificates = yield store.Certificates;
          const count = yield certificates.Count;

          for (let i = 1; i <= count; i++) {
            try {
              const certificate = yield certificates.Item(i);
              const is_valid = yield certificate.IsValid();

              certificates_array.push({
                issuer_name: _convertStringToObj(yield certificate.IssuerName),
                serial_number: yield certificate.SerialNumber,
                subject_name: _convertStringToObj(yield certificate.SubjectName),
                thumbprint: yield certificate.Thumbprint,
                private_key: yield certificate.PrivateKey,
                Valid_from_date: yield certificate.ValidFromDate,
                Valid_to_date: yield certificate.ValidToDate,
                is_valid: yield is_valid.Result,
                version: yield certificate.Version
              });
            } catch(err) {
              console.error(err);
            }
          }

          yield store.Close();

          args[0](certificates_array);
        } catch (err) {
          args[1](cadesplugin.getLastError(err));
        }
      }, resolve, reject);
    });
  }

  /**
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

        try {
          const certificate = store
                                .Certificates
                                .Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint)
                                .Item(1);
        } catch(_err) {
          reject(`Сертификат не найден: ${thumbprint}`)
        }

        const signer = cadesplugin.CreateObject("CAdESCOM.CPSigner");
        signer.Certificate = certificate;

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

          try {
            const certificatesObj = yield store.Certificates;
            const certificates = yield certificatesObj
                                         .Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, args[0]);

            const certificate = yield certificates.Item(1);
          } catch (_err) {
            args[3]("Сертификат не найден: " + args[0])
          }

          const signer = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
          yield signer.propset_Certificate(certificate);

          const signedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
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

        try {
          const certificate = store
                                .Certificates
                                .Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint)
                                .Item(1);
        } catch (err) {
          reject(`Сертификат не найден: ${thumbprint}`)
        }

        const x509certificate = certificate.Export(0);

        const rawSignature = cadesplugin.CreateObject("CAdESCOM.RawSignature");

        const signatureHex = rawSignature.SignHash(hashed_data, certificate);

        store.Close();

        resolve({
          signature_value: _reverse(_hexToString(signatureHex)),
          x509certificate: x509certificate
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
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

          const hashed_data = yield hashedData.Hash(args[1]);

          const store = yield cadesplugin.CreateObjectAsync("CAPICOM.Store");

          yield store.Open();

          try {
            const certificatesObj = yield store.Certificates;
            const certificates = yield certificatesObj
                                         .Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, args[0]);
            const certificate = yield certificates.Item(1);
          } catch (err) {
            args[3](`Сертификат не найден: ${args[0]}`);
          }

          const x509certificate = yield certificate.Export(0);

          const rawSignature = yield cadesplugin.CreateObjectAsync("CAdESCOM.RawSignature");

          const signatureHex = yield rawSignature.SignHash(hashed_data, certificate);

          yield store.Close();

          args[2]({
            signature_value: _reverse(_hexToString(signatureHex)),
            x509certificate: x509certificate
          });
        } catch (err) {
          args[3](cadesplugin.getLastError(err));
        }
      }, thumbprint, base64, resolve, reject);
    });
  }

  /**
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
   * @description Method for reversing a string
   * @param {string} str - string for reversing
   * @return {string} reverse string
   */
  const _reverse = (str) => {
    let string = '';

    for (let i = str.length - 1; i >= 0; i--) {
      string += str.charAt(i);
    }

    return string;
  }

  /**
   * @description Method convert hex into base64
   * @param {string} hex - string for convert
   * @return {string} converted base64 string
   */
  const _hexToString = (hex) => {
    let string = '';

    for (let i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }

    return window.btoa(string);
  }

  return {
    certificates: isAsync() ? certificatesAsync : certificates,
    sign: isAsync() ? signAsync : sign,
    paramsForDetachedSignature: isAsync() ? paramsForDetachedSignatureAsync : paramsForDetachedSignature
  }
}

module.exports = CryptoProProvider();
