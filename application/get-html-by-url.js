const fetch = require('../infrastructure/api/getPage');
const render = require('../infrastructure/browser/get-page');

const GETTING_MODE_TYPES = require('../utils/gettingModeTypes');

const getHtml = async (url, mode = GETTING_MODE_TYPES.FETCH) => {
  if (mode === 'FETCH') {
    return await fetch(url);
  } else {
    return await render(url);
  }
}

module.exports = getHtml;