const axios = require('axios');
const cheerio = require('cheerio');
const scraperCtrl = require('./modules/scraped/controller');

let toScraping = [];
let cont = 0;
let arrayLength = 0;
scraperCtrl.getEnables().then((rows) => {
  if (rows.length > 0) {
    toScraping = rows;
    arrayLength = rows.length;
    executeScraping(toScraping[cont], cont);
  }
});


const executeScraping = (rules, cont) => {
  if(cont < arrayLength) {
    axios(rules.url_to_scrape)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      $(rules.price_dom_selector, html).each(function() {
        const price = $(this).text();
        const number = Number(price.replace(/[^0-9.-]+/g,""));
        console.log(`number ${number}`);
        if (number >= rules.notify_price_more_equal_than || number <= rules.notify_price_smaller_equal_than) {
          console.log('AVISAR');
        }
        if (rules.stock_dom_selector) {
          $(rules.stock_dom_selector, html).each(function() {
            const stock = $(this).text();
            console.log(stock);
            cont ++;
            executeScraping(toScraping[cont], cont);
          });
        } else {
          cont ++;
          executeScraping(toScraping[cont], cont);
        }
      });
    })
    .catch(error => {
      console.log(error);
    });    
  }
}

