import { cadesplugin, CADESCOM_CURRENT_USER_STORE } from '../constants';
import { convertStringToObj } from '../utils';

/**
 * @function
 * @name certificates
 * @description Provides access to loaded certificates for browser
 * @return {array} list of certificates
 */
const certificates = () => (
  new Promise((resolve, reject) => {
    const certificatesArray = [];

    try {
      const store = cadesplugin.CreateObject('CAPICOM.Store');
      store.Open(CADESCOM_CURRENT_USER_STORE);

      const availableCertificates = store.Certificates;
      const count = availableCertificates.Count;

      for (let i = 1; i <= count; i++) {
        try {
          const certificate = availableCertificates.Item(i);
          const isValid = availableCertificates.IsValid();

          certificatesArray.push({
            issuerName: convertStringToObj(certificate.IssuerName),
            serialNumber: certificate.SerialNumber,
            subjectName: convertStringToObj(certificate.SubjectName),
            thumbprint: certificate.Thumbprint,
            validFromDate: certificate.ValidFromDate,
            validToDate: certificate.ValidToDate,
            isValid: isValid.Result,
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
  })
);

export default certificates;
