require('./vendor/cadesplugin_api');

const CryptoProProvider = () => {
  const _version = '0.0.1';
  const _CADESCOM_CADES_BES = 1;
  const _CADESCOM_BASE64_TO_BINARY = 1;
  const _CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0;
  const _CADESCOM_HASH_ALGORITHM_CP_GOST_3411 = 100;

  const getVersion = () => {
    return `Версия плагина ${_version}`;
  }

  return {
    getVersion: getVersion
  }
}

module.exports = CryptoProProvider();
