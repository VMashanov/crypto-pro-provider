/* eslint-disable */

import base64 from 'base-64';

describe('external libs', () => {
  describe('base-64', () => {
    test('should return encoded string', () => {
      const str = 'Hello, World!!!';
      const result = 'SGVsbG8sIFdvcmxkISEh';

      const subject = base64.encode(str);

      expect(subject).toEqual(result);
    });

    test('should return decoded string', () => {
      const base64Str = 'SGVsbG8sIFdvcmxkISEh';
      const result = 'Hello, World!!!';

      const subject = base64.decode(base64Str);

      expect(subject).toEqual(result);
    });
  });
});
