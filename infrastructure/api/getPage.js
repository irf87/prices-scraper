const axios = require('axios');

const fetch = async (url) => {
  let dataResp;
  let errorResp;
  try {
    const { data, error } = await axios(url);
    dataResp = data;
    errorResp = error;

  } catch(err) {
    errorResp = err;
  }

  return {
    data: dataResp,
    error: errorResp,
  }
}

module.exports = fetch;
