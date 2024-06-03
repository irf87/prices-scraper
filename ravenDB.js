const ravenInstance = require('./infrastructure/storage/ravenDBController');

const p1 = {
  "_id": 25,
  "name": "HiBy R3 II",
  "description": "HiFi Audio Player with HiByOS",
  "urlInfo": "https://store.hiby.com/products/hiby-r3-ii",
  "urlImg": "https://store.hiby.com/cdn/shop/files/HiBy-R3-II-Entry-level-HiFi-Audio-Player-Music-Player-with-HiByOS-HiBy-_-Make-Music-More-Musical-62459130.png",
  "productScrapedId": 36,
  "urlToScrape": "https://www.amazon.com.mx/HiBy-R3-II-Reproductor-p%C3%A9rdidas/dp/B0CJVRBPST",
  "price": 3903,
  "date": "2024-04-09T00:00:17.047Z",
  collection: 'products',
  "@metadata": {
    "@collection": 'products',
  }
};

const p2 = {
  "_id": 27,
  "name": "UGREEN USB C Lector de Tarjetas",
  "description": "UGREEN USB C Lector de Tarjetas TF, Adaptador de Tarjetas de Memoria Micro SD USB Tipo C Card Reader TF para iPhone 15/Pro Max MacBook Pro MacBook Air iPad Pro 2022 2020 Galaxy S24 S23 S22 Huawei, Oro",
  "urlInfo": "",
  "urlImg": "https://m.media-amazon.com/images/I/611cte-lWQL._AC_SX679_.jpg",
  "productScrapedId": 39,
  "urlToScrape": "https://www.amazon.com.mx/gp/product/B08131PLHZ?smid=AKXVBT49GGF3B",
  "price": 178,
  "date": "2024-04-09T00:00:26.530Z",
  "@metadata": {
    "@collection": 'products',
  }
};

const executeDataBse = async () => {
  const doc = p2;
  // await ravenInstance.create(doc, `productScrapedrecords/`, 'marketplace');
  // console.log('intenta');
  // const result = await ravenInstance.load(`productScrapedRecords/0000000000000000038-A`);
  const s = ravenInstance.getSession();
  // const result3 = await s.load(`productScrapedrecords/0000000000000000038-A`);
  // console.log('====');
  // console.log(result3);
  // console.log('obtuve');
  // console.log(JSON.stringify(result));
  // const result2 = await ravenInstance.query({ collection: 'products' });
  // const result4 = await s.query({ collection: 'products' }).all();
  // console.log('todos');
  // console.log(result4);
  // console.log('busqueda');
  // const result5 = await s.query({ collection: 'products' }).whereEquals('_id', 28).single();
  // console.log(result5);
  const result4 = await s.query({ collection: 'productScrapedRecordsSnap' }).all();
  console.log(result4);
}

console.log('EJECUTAR');
executeDataBse();