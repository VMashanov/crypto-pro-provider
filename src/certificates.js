import { cadesplugin, CADESCOM_CURRENT_USER_STORE } from './constants';
import { convertStringToObj } from './utils';

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

const objectifyCertificate = async (certificate) => {
  const isValid = await certificate.IsValid();

  const objectWithCertificate = {
    issuerName: convertStringToObj(await certificate.IssuerName),
    serialNumber: await certificate.SerialNumber,
    subjectName: convertStringToObj(await certificate.SubjectName),
    thumbprint: await certificate.Thumbprint,
    privateKey: await certificate.PrivateKey,
    validFromDate: await certificate.ValidFromDate,
    validToDate: await certificate.ValidToDate,
    isValid: await isValid.Result,
    version: await certificate.Version,
  };

  return objectWithCertificate;
};

const collectListOfCertificats = async (certificates, amountOfCertificates, i, result = []) =>
  (i > amountOfCertificates
    ? result
    : collectListOfCertificats(
      certificates,
      amountOfCertificates,
      i + 1,
      result.concat(await objectifyCertificate(await certificates.Item(i))),
    )
  );

/**
 * @function
 * @name certificatesAsync
 * @description Provides access to loaded certificates for browser (Async)
 * @return {array} list of certificates
 */

export const certificatesAsync = async () => {
  const store = await cadesplugin.CreateObjectAsync('CAPICOM.Store');
  await store.Open(CADESCOM_CURRENT_USER_STORE);
  const certificates = await store.Certificates;
  const amountOfCertificates = await certificates.Count;
  const arrayOfCertificates
    = collectListOfCertificats(certificates, amountOfCertificates, 1);

  return arrayOfCertificates;
};
