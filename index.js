const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();

const URL_CYBERPUERTA = 'https://www.cyberpuerta.mx/Computo-Hardware/Componentes/Tarjetas-de-Video/Tarjeta-de-Video-EVGA-NVIDIA-GeForce-GT-1030-2GB-64-bit-GDDR5-PCI-Express-x16-3-0.html';
const SELECTOR = '#productinfo > form > div.detailsInfo.clear > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(4) > div.medium-7.cell.cp-pr > div > div > div.mainPrice';
console.log('RUN');
axios(URL_CYBERPUERTA)
  .then(response => {
    const html = response.data;
    console.log('Responde');
    // console.log(html);
    const $ = cheerio.load(html);
    $(SELECTOR, html).each(function() {
      console.log('yupi');
      const price = $(this).text();
      console.log(price);
    });
  })
  .catch(error => {
    console.log('Hubo pedo');
    console.log(error);
  });

// app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));