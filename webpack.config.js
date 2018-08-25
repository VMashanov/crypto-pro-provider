/* eslint-disable */

const environment = process.env.NODE_ENV || 'development';

require(`./${environment}.webpack.config.js`);
