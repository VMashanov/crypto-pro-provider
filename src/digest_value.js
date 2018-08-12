import {
  CreateObjectAsync,
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
const digestValue = async (hashedData) => {
  const oHashedData = await CreateObjectAsync('CAdESCOM.HashedData');

  await oHashedData.propset_Algorithm(CADESCOM_HASH_ALGORITHM_CP_GOST_3411);
  await oHashedData.propset_DataEncoding(CADESCOM_BASE64_TO_BINARY);
  await oHashedData.Hash(hashedData);

  return oHashedData.Value;
};

export default digestValue;
