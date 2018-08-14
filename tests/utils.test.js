/* eslint-disable */

import {
  convertStringToObj,
} from '../src/utils';

describe('utils', () => {
  describe('#convertStringToObj', () => {
    test('should return object from string', () => {
      const str = 'CN=1, MN=2';
      const result = { CN: '1', MN: '2' };

      const subject = convertStringToObj(str);

      expect(subject).toEqual(result);
    });
  });
});
