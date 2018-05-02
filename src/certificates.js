import { cadesplugin, CADESCOM_CURRENT_USER_STORE } from './constants';
import { convertStringToObj, fromAsync } from './utils';

/**
 * @function
 * @name certificates
 * @description Provides access to loaded certificates for browser
 * @return {array} list of certificates
 */
export const certificates = () => {
  return new Promise((resolve, reject) => {
    const certificatesArray = [];

    try {
      const store = cadesplugin.CreateObject('CAPICOM.Store');
      store.Open(CADESCOM_CURRENT_USER_STORE);

      const certificates = store.Certificates;
      const count = certificates.Count;

      for (let i = 1; i <= count; i++) {
        try {
          const certificate = certificates.Item(i);
          const isValid = certificate.IsValid();

          certificatesArray.push({
            issuer_name: convertStringToObj(certificate.IssuerName),
            serial_number: certificate.SerialNumber,
            subject_name: convertStringToObj(certificate.SubjectName),
            thumbprint: certificate.Thumbprint,
            valid_from_date: certificate.ValidFromDate,
            valid_to_date: certificate.ValidToDate,
            is_valid: isValid.Result,
            version: certificate.Version,
          });
        } catch (err) {
          console.error(err);
        }
      }

      store.Close();

      resolve(certificatesArray);
    } catch (err) {
      reject(cadesplugin.getLastError(err));
    }
  });
};

/**
 * @function
 * @name certificatesAsync
 * @description Provides access to loaded certificates for browser (Async)
 * @return {array} list of certificates
 */

export const certificatesAsync = async () =>
  new Promise((resolve, reject) => {
    const store = await cadesplugin.CreateObjectAsync('CAPICOM.Store');
    await store.Open(CADESCOM_CURRENT_USER_STORE);
    const certificates = await store.Certificates;
    console.log('========', certificates);
    resolve(true);
  });

// export const certificatesAsync = () =>
//   new Promise((resolve, reject) => {
//     cadesplugin.async_spawn(function *(args) {
//       const certificatesArray = [];

//       try {
//         const store = yield cadesplugin.CreateObjectAsync('CAPICOM.Store');
//         yield store.Open(CADESCOM_CURRENT_USER_STORE);

//         const certificates = yield store.Certificates;
//         const count = yield certificates.Count;

//         for (let i = 1; i <= count; i++) {
//           try {
//             const certificate = yield certificates.Item(i);
//             const isValid = yield certificate.IsValid();

//             certificatesArray.push({
//               issuer_name: convertStringToObj(yield certificate.IssuerName),
//               serial_number: yield certificate.SerialNumber,
//               subject_name: convertStringToObj(yield certificate.SubjectName),
//               thumbprint: yield certificate.Thumbprint,
//               private_key: yield certificate.PrivateKey,
//               valid_from_date: yield certificate.ValidFromDate,
//               valid_to_date: yield certificate.ValidToDate,
//               is_valid: yield isValid.Result,
//               version: yield certificate.Version,
//             });
//           } catch(err) {
//             console.error('====', err);
//           }
//         }

//         yield store.Close();

//         args[0](certificatesArray);
//       } catch (err) {
//         args[1](cadesplugin.getLastError(err));
//       }
//     }, resolve, reject);
//   });
