// Configuration file for the math calculator backend
const httpsConfig = require('./https.config');

const config = {
  port: process.env.PORT || httpsConfig.port,
  apiKey: process.env.API_KEY || httpsConfig.apiKey,
  nodeEnv: process.env.NODE_ENV || httpsConfig.nodeEnv
};

module.exports = config;
