/* eslint-disable */

import {
  convertStringToObj,
  hexToBase64,
  injectToXML,
} from '../src/utils';

import fixtures from './fixtures/utils';

describe('utils', () => {
  describe('#convertStringToObj', () => {
    test('should return object from string', () => {
      const str = 'CN=1, MN=2';
      const result = { CN: '1', MN: '2' };

      const subject = convertStringToObj(str);

      expect(subject).toEqual(result);
    });
  });

  describe('#hexToBase64', () => {
    test('should return base64 from hex', () => {
      const hex = 'a660b03bc56d364fce9c482632b9f864';
      const result = 'ZPi5MiZInM5PNm3FO7Bgpg==';

      const subject = hexToBase64(hex);

      expect(subject).toEqual(result);
    });
  });

  describe('#injectToXML', () => {
    test('should return transformed xml', () => {
      const signatureValue = '111';
      const x509certificate = '222';

      const subject = injectToXML(
        fixtures.injectToXML.xml,
        signatureValue,
        x509certificate,
      );

      expect(subject).toEqual(fixtures.injectToXML.result);
    });
  });
});
