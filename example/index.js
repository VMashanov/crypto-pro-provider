import {
  certificates,
  sign,
} from '../src/index';

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(getCertificates, 1500);
});

const getCertificates = () =>
  certificates().then(certificates => injectListOfCertificates(certificates));

const injectListOfCertificates = (certificates) => {
  const parentElement = document.querySelector('.certificates__list');
  buildListOfCertificates(certificates)
    .map(node => parentElement.appendChild(node));
};

const buildListOfCertificates = certificates =>
  certificates.reduce((result, certificate) =>
    result.concat(buildCertificateItem(certificate)), []);

const buildCertificateItem = (certificate) => {
  const div = document.createElement('div');

  div.className = 'certificates__list__item';
  div.innerHTML = `${certificate.subjectName.CN} Алгоритм: ${certificate.algorithm}`;
  div.onclick = () =>
    sign(certificate.thumbprint, getDataFromInput()).then((signature) => {
      document.querySelector('.result').innerHTML = signature;
    });

  return div;
};

const getDataFromInput = () => {
  const { value } = document.querySelector('.field');
  return convertToBase64(value) || alert('You need to write any text!');
};

const convertToBase64 = value => window.btoa(value);
