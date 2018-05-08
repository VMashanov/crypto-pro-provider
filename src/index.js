import certificatesNPAPI from './npapi/certificates';
import certificatesAsync from './async/certificates';


import { sign, signAsync } from './sign';
import {
  paramsForDetachedSignature,
  paramsForDetachedSignatureAsync,
} from './params_for_detached_signature';
import { digestValue, digestValueAsync } from './digest_value';
import { cadesplugin } from './constants';

/**
 * @class
 * @name CryptoProProvider
 * @description Module provide methods for signing requests with Crypto Pro
 * @author Vitaly Mashanov <vvmashanov@yandex.ru>
 */

/**
 * @function
 * @name isAsync
 * @description Checking, which method used by browser (Async or NPAPI)
 * @return {boolean}
 */
const isAsync = () => (cadesplugin.CreateObjectAsync || false);

export default {
  certificates: isAsync() ? certificatesAsync : certificatesNPAPI,
  sign: isAsync() ? signAsync : sign,
  paramsForDetachedSignature: isAsync() ? paramsForDetachedSignatureAsync : paramsForDetachedSignature,
  digestValue: isAsync() ? digestValueAsync : digestValue,
};
