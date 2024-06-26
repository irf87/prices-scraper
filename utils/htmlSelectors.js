const amazon = 'amazon';
const mercadoLibre = 'mercadolibre';
const cyberpuerta = 'cyberpuerta';

const amazonSelectors = {
  'price_dom_selector': '#corePrice_feature_div > div > span > span:nth-child(2) > span.a-price-whole',
  'stock_dom_selector': '',
  'available_dom_selector': '#availability > span'
};

const mercadoLibreSelectors = {
  'price_dom_selector': '#ui-pdp-main-container > div.ui-pdp-container__col.col-3.ui-pdp-container--column-center.pb-16 > div > div.ui-pdp-container__row.ui-pdp-with--separator--fluid.ui-pdp-with--separator--40 > div.ui-pdp-container__col.col-2.mr-32 > div.ui-pdp-price.mt-16.ui-pdp-price--size-large > div.ui-pdp-price__main-container > div.ui-pdp-price__second-line > span:nth-child(1) > span',
  'stock_dom_selector': '#buybox-form > div.ui-pdp-stock-and-full > div.ui-pdp-stock-information > p',
  'available_dom_selector': '#quantity-selector > span > span.ui-pdp-buybox__quantity__available'
};

const cyberpuertaSelectors = {
  'price_dom_selector': '#productinfo > form > div.detailsInfo.clear > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(4) > div.medium-7.cell.cp-pr > div > div > div.mainPrice > span',
  'stock_dom_selector': '#productinfo > form > div.detailsInfo.clear > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(4) > div.medium-7.cell.cp-pr > div > div > div.stock > span > span',
  'available_dom_selector': '#productinfo > form > div.detailsInfo.clear > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(4) > div.medium-7.cell.cp-pr > div > div > div.stock > span'
};

const SITES = {
  amazon,
  mercadoLibre,
  cyberpuerta,
};

const sitesList = () => Object.keys(SITES);

const SITE_SELECTORS = {
  [amazon]: amazonSelectors,
  [mercadoLibre]: mercadoLibreSelectors,
  [cyberpuerta]: cyberpuertaSelectors,
};

module.exports = {
  SITES,
  SITE_SELECTORS,
  sitesList,
}