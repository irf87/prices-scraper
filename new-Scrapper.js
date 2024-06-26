const jsdom = require('jsdom');
const { chromium, firefox } = require('playwright');
const { JSDOM } = jsdom;
const axios = require('axios'); // O usa node-fetch
const cheerio = require('cheerio');

// execute npx playwright install 

const DomAnalyzer = require('./utils/domAnalyzer');

const priceSelector = '#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-right > div.price--wrap--tA4MDk4.product-price > div.price--current--H7sGzqb.product-price-current > div';
const testSelector = '#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-right > div.title--wrap--Ms9Zv4A > h1';

// async function obtenerHTMLRenderizado(url) {
//     try {
//         const response = await axios.get(url);
//         const html = response.data;
//         const dom = new JSDOM(html);
//         console.log(dom.window.document.querySelector(testSelector).textContent); // "Hello world"
//         // Ahora puedes manipular el DOM renderizado
//         // const data = dom.window.document.documentElement.outerHTML;
//         // console.log('===');
//         // console.log(data);
//         // console.log('===');
//         // const $ = cheerio.load(data);
//         // const p = $('#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-right > div.title--wrap--Ms9Zv4A > h1').text();
//         // console.log('INTENTA');
//         // console.log(p);
//         // const domRender = new DomAnalyzer($, data);
//         // const promisePrice = new Promise((resolve) => {
//         //   domRender.getPrice(priceSelector, resolve);
//         // });
//         // const price = await promisePrice;
//         // console.log(`price selector ${price}`);
//     } catch (error) {
//         console.error('Error al obtener el HTML:', error.message);
//     }
// }

async function obtenerHTMLRenderizado(url) {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url);
  // Esperar a que la página se cargue completamente
  await page.waitForLoadState('networkidle');

  // Obtener el HTML renderizado
  const html = await page.content();
  console.log(html);
  const $ = cheerio.load(html);
  const domRender = new DomAnalyzer($, html);
  const promisePrice = new Promise((resolve) => {
    domRender.getPrice(priceSelector, resolve);
  });
  const price = await promisePrice;
  console.log(price);

  await browser.close();
}


obtenerHTMLRenderizado('https://es.aliexpress.com/item/1005006063127634.html?spm=a2g0o.productlist.main.13.79ff1idJ1idJby&algo_pvid=3f0096d8-5fc2-4c7c-ad6a-f799a143f346&aem_p4p_detail=20240411190723725813775248430001296815&algo_exp_id=3f0096d8-5fc2-4c7c-ad6a-f799a143f346-6&pdp_npi=4%40dis%21MXN%2148.98%2148.98%21%21%212.92%212.92%21%402103253417128876430455932ed370%2112000037851753581%21sea%21MX%210%21AB&curPageLogUid=BF2GTBp8W2in&utparam-url=scene%3Asearch%7Cquery_from%3A&search_p4p_id=20240411190723725813775248430001296815_7');