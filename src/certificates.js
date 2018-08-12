import {
  CreateObjectAsync,
  CADESCOM_CURRENT_USER_STORE,
} from './constants';
import { convertStringToObj } from './utils';

/**
 * @function
 * @name certificates
 * @description Provides access to loaded certificates for browser (Async)
 * @return {array} list of certificates
 */
const certificates = async () => {
  const store = await CreateObjectAsync('CAPICOM.Store');
  await store.Open(CADESCOM_CURRENT_USER_STORE);
  const availableCertificates = await store.Certificates;
  const amountOfCertificates = await availableCertificates.Count;
  const arrayOfCertificates = collectListOfCertificats(
    availableCertificates,
    amountOfCertificates,
    1,
  );

  return arrayOfCertificates;
};

const collectListOfCertificats =
  async (certificates, amountOfCertificates, i, result = []) =>
    (i > amountOfCertificates
      ? result
      : collectListOfCertificats(
        certificates,
        amountOfCertificates,
        i + 1,
        result.concat(await objectifyCertificate(await certificates.Item(i))),
      )
    );

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

export default certificates;
