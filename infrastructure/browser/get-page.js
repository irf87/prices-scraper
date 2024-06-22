const jsdom = require('jsdom');
const { chromium, firefox } = require('playwright');
const { JSDOM } = jsdom;

const getHtmlByRender = async (url) => {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let data;
  let error;
  try {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    data = await page.content();
  } catch(err) {
    error = err;
  }
  return { data, error };
}

module.exports = getHtmlByRender;