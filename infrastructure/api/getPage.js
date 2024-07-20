require('dotenv').config();
const axios = require('axios');
const { printDate } = require('../../utils/date/printDate');

const DEBUG	= process.env._IS_DEBUG;
const isDebug = DEBUG === 'true'

const fetch = async (url) => {
  let dataResp;
  let errorResp;
  try {
    const { data, error } = await axios(url);
    if (isDebug) {
      onsole.log(`\nfetch start at ${printDate()}`);
      console.log(`get:url ${url}`);
    }
    dataResp = data;
    if (isDebug) {
      console.log(`\nget:error ${error}`);
    }
    errorResp = error;

  } catch(err) {
    if (isDebug) {
      console.log(`\nget:error ${err}`);
    }
    errorResp = err;
  }
  if (isDebug) {
    console.log(`fetch finish at ${printDate()}`);
  }
  return {
    data: dataResp,
    error: errorResp,
  }
}

module.exports = fetch;
