/**
 * @function
 * @name convertDate
 * @description Method returns date
 * @param {string} navigatorName - name of frowser
 * @param {Date} date - date now
 * @return {string} date
 */
export const convertDate = (navigatorName, date = new Date()) =>
  (navigatorName === 'Microsoft Internet Explorer' ? date.getVarDate() : date);

/**
 * @function
 * @name convertStringToObj
 * @description Method convert string into object
 * @param {string} str - string for convert
 * @return {object} converted string
 */
export const convertStringToObj =
  str => str.split(', ').reduce((result, subString) => {
    const partsOfSubString = subString.split('=');
    return { ...result, [partsOfSubString[0]]: partsOfSubString[1] };
  }, {});

/**
 * @function
 * @name hexToBase64
 * @description Method convert hex into base64
 * @param {string} hex - string for convert
 * @param {string} str - empty string
 * @param {string} index - start position of substring
 * @return {string} converted base64 string
 */
export const hexToBase64 = (hex, str, index) => {
  if (index >= 0) {
    return hexToBase64(
      hex,
      str + String.fromCharCode(parseInt(hex.substr(index, 2), 16)),
      index - 2
    );
  }

  return window.btoa(str);
};

export const fromAsync = async (value) => {
  const resultOfAsynchronousFunction = await value;
  return resultOfAsynchronousFunction;
};
