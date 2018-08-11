import {
  cadesplugin,
  CADESCOM_HASH_ALGORITHM_CP_GOST_3411,
  CADESCOM_BASE64_TO_BINARY,
} from './constants';

/**
 * @function
 * @name digestValue
 * @description Method returns promise with checksum of data that
 * transmitted in the parameters
 * @param {string} hashedData - string for checksum calculating
 * @return {string} checksum of data
 */
const digestValue = (hashedData) => {
  return new Promise((resolve, reject) => {
    cadesplugin.async_spawn(function *(args) {
      try {
        const oHashedData = yield cadesplugin.CreateObjectAsync('CAdESCOM.HashedData');

        yield oHashedData.propset_Algorithm(CADESCOM_HASH_ALGORITHM_CP_GOST_3411);
        yield oHashedData.propset_DataEncoding(CADESCOM_BASE64_TO_BINARY);
        yield oHashedData.Hash(args[0]);

        const sHashValue = yield oHashedData.Value;

        args[1](sHashValue);
      } catch (err) {
        args[2](cadesplugin.getLastError(err));
      }
    }, hashedData, resolve, reject);
  });
};

export default digestValue;
