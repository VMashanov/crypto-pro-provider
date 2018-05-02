import CryptoProProvider from '../src/index';

document.addEventListener('DOMContentLoaded', () => CryptoProProvider.certificates().then(certificates => console.log('-----', certificates)));
