/**
 * @const
 * @name CADESCOM_CADES_BES
 * @description Signature type CAdES BES
 */
export const CADESCOM_CADES_BES = 1;

/**
 * @const
 * @name CADESCOM_BASE64_TO_BINARY
 * @description Data will reencoded from base64 into binary array
 */
export const CADESCOM_BASE64_TO_BINARY = 1;

/**
 * @const
 * @name CAPICOM_CERTIFICATE_FIND_SHA1_HASH
 * @description Finding certificates by SHA1 hash
 */
export const CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0;

/**
 * @const
 * @name CADESCOM_HASH_ALGORITHM_CP_GOST_3411
 * @description Algorithm GOST R 34.11-94
 */
export const CADESCOM_HASH_ALGORITHM_CP_GOST_3411 = 100;

/**
 * @const
 * @name CADESCOM_CURRENT_USER_STORE
 * @description Finding certificates from a storage of current user
 */
export const CADESCOM_CURRENT_USER_STORE = 2;

/**
 * @const
 * @name CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME
 * @description Time of signing
 */
export const CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0;

/**
 * @const
 * @name cadesplugin
 * @description Provide access to cadesplugin_api
 */
export const { cadesplugin: { CreateObjectAsync } } = window;
