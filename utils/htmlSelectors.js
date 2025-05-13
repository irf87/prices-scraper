const GETTING_MODE_TYPES = require('./gettingModeTypes');

const amazon = 'amazon';
const mercadoLibre = 'mercadolibre';
const cyberpuerta = 'cyberpuerta';
const etsy = 'etsy';
const sams = 'sams';
const soriana = 'soriana';
const laComer = 'lacomer';
const liverpool = 'liverpool';
const shasa = 'shasa';
const fahorro = 'fahorro';
const officedepot = 'officedepot';

const amazonSelectors = {
  'price_dom_selector': '.a-price .a-offscreen',
  'stock_dom_selector': '',
  'available_dom_selector': '#availability > span',
  'product_name_dom_selector': '#productTitle',
  'product_description_dom_selector': '#feature-bullets > ul',
  'image_product_dom_selector': '#landingImage',
  'getting_mode': GETTING_MODE_TYPES.FETCH
};

const mercadoLibreSelectors = {
  'price_dom_selector': 'meta[itemprop="price"]',
  'stock_dom_selector': '#quantity-selector > span > span.ui-pdp-buybox__quantity__available',
  'available_dom_selector': '#stock_information > div > p',
  'product_name_dom_selector': 'h1.ui-pdp-title',
  'product_description_dom_selector': 'meta[property="og:description"]',
  'image_product_dom_selector': 'meta[property="og:image"]',
  'getting_mode': GETTING_MODE_TYPES.FETCH
};

const cyberpuertaSelectors = {
  'price_dom_selector': 'div.mainPrice > span',
  'stock_dom_selector': 'div.stock > span',
  'available_dom_selector': 'span.stockFlag',
  'product_name_dom_selector': '#productinfo > form > div.detailsInfo.clear > div:nth-child(1) > div:nth-child(2) > div > h1',
  'product_description_dom_selector': '#productinfo > form > div.detailsInfo.clear > div:nth-child(2) > div:nth-child(2) > div > div > ul',
  'image_product_dom_selector': '#emzoommainpic > img',
  'getting_mode': GETTING_MODE_TYPES.FETCH
};

const etsySelectors = {
  'price_dom_selector': '#listing-page-cart > div.wt-display-flex-xs.wt-align-items-center > div:nth-child(1) > div > p.wt-text-title-larger.wt-mr-xs-1.wt-text-slime',
  'stock_dom_selector': '',
  'available_dom_selector': '',
  'product_name_dom_selector': '#listing-page-cart > div:nth-child(5) > h1',
  'product_description_dom_selector': '#content-toggle-product-details-read-more > p',
  'image_product_dom_selector': '#photos > div.listing-page-image-carousel-component.wt-display-flex-xs.is-initialized > div.image-carousel-container.wt-position-relative.wt-flex-xs-6.wt-order-xs-2.show-scrollable-thumbnails > ul > li:nth-child(1) > img',
  'getting_mode': GETTING_MODE_TYPES.RENDER
}

const sorianaSelectors = {
  'price_dom_selector': '#maincontent > div.container.product-detail.product-wrapper > div > div > div.product-detail__content-container > div.product-detail__details-container > div.prices.move-to-right.text-left.pt-0 > div > div > div.d-flex.price-content.mx-0.row > div > span > span',
  'stock_dom_selector': '',
  'available_dom_selector': '',
  'product_name_dom_selector': '#maincontent > div.container.product-detail.product-wrapper > div > div > div.c-product-name.col-12.d-flex.px-1 > h1',
  'product_description_dom_selector': '#videosMobile',
  'image_product_dom_selector': 'meta[property="og:image"]',
  'getting_mode': GETTING_MODE_TYPES.RENDER
}

const samsSelectors = {
  'price_dom_selector': '[itemprop="price"]',
  'stock_dom_selector': '',
  'available_dom_selector': '',
  'product_name_dom_selector': '#main-title',
  'product_description_dom_selector': '#item-product-details > div.w_zz0G.expand-collapse-content > div',
  'image_product_dom_selector': '#maincontent > section > main > div.flex.flex-column.h-100 > div:nth-child(2) > div > div.w_8XBa.w_n9r1.w_JFBv > div > div > section.flex.items-center > div.self-center.relative.mr3.ml7.overflow-hidden > div.w-100 > div > div > div > img',
  'getting_mode': GETTING_MODE_TYPES.RENDER
}

const laComerSelectors = {
  'price_dom_selector': '#detalleSection > div > ng-template > span',
  'stock_dom_selector': '',
  'available_dom_selector': '',
  'product_name_dom_selector': '#detalleSection > div:nth-child(1) > div.col-xs-9.col-md-10.pl-0 > span',
  'product_description_dom_selector': '#detalleSection > tab-component > div > div.tab__container > ng-transclude > div.tab__container__information.ng-scope > div:nth-child(1) > p.description__information.ng-binding',
  'image_product_dom_selector': '#product-container > div > div > div.middle-cont > div > span > span > img.zoomImg',
  'getting_mode': GETTING_MODE_TYPES.RENDER
}

const liverpoolSelectors = {
  'price_dom_selector': '#__next > main > div.min-vh-100 > section.o-product__detail > div > main > div.o-product__description.liverpool > div.m-product__price-dw-promotion > div > div > div > p.a-product__paragraphDiscountPrice.m-0.d-inline',
  'stock_dom_selector': '',
  'available_dom_selector': '',
  'product_name_dom_selector': '#__next > main > div.min-vh-100 > section.o-product__detail > div > main > div.o-product__description.liverpool > div.product-header-container.liverpool.wide-layout > h1',
  'product_description_dom_selector': '#o-product__productSpecsDetails > div.row > div > div > div > div.productDetailTab',
  'image_product_dom_selector': '#image-real',
  'getting_mode': GETTING_MODE_TYPES.RENDER
}

const shasaSelectors = {
  'price_dom_selector': '#price-template--19412545765588__main > div.price.price--product > dl > div.price__regular > dd > span',
  'stock_dom_selector': '',
  'available_dom_selector': '',
  'product_name_dom_selector': '#ProductInfo-template--19412545765588__main > div.product__title__wrapper > h1',
  'product_description_dom_selector': '#ProductInfo-template--19412545765588__main > div:nth-child(10) > div > div > div > div > div',
  'image_product_dom_selector': 'meta[property="og:image"]',
  'getting_mode': GETTING_MODE_TYPES.RENDER
}

const fahorroSelectors = {
  'price_dom_selector': '.price',
  'stock_dom_selector': '',
  'available_dom_selector': '',
  'product_name_dom_selector': '[itemprop="name"]',
  'product_description_dom_selector': '.value',
  'image_product_dom_selector': 'meta[property="og:image"]',
  'getting_mode': GETTING_MODE_TYPES.RENDER
}

const officedepotSelectors = {
  'price_dom_selector': '#priceData',
  'stock_dom_selector': '',
  'available_dom_selector': '',
  'product_name_dom_selector': '.p-name',
  'product_description_dom_selector': 'meta[property="og:description"]',
  'image_product_dom_selector': 'meta[property="og:image"]',
  'getting_mode': GETTING_MODE_TYPES.FETCH
}

const SITES = {
  amazon,
  mercadoLibre,
  cyberpuerta,
  // etsy,
  soriana,
  // sams,
  // laComer,
  liverpool,
  // shasa,
  fahorro,
  officedepot,
};

const sitesList = () => Object.keys(SITES);

const SITE_SELECTORS = {
  [amazon]: amazonSelectors,
  [mercadoLibre]: mercadoLibreSelectors,
  [cyberpuerta]: cyberpuertaSelectors,
  [etsy]: etsySelectors,
  [soriana]: sorianaSelectors,
  [laComer]: laComerSelectors,
  [sams]: samsSelectors,
  [liverpool]: liverpoolSelectors,
  [shasa]: shasaSelectors,
  [fahorro]:  fahorroSelectors,
  [officedepot]: officedepotSelectors,
};

const SITE_URL = {
  [amazon]: 'amazon.com',
  [mercadoLibre]: 'mercadolibre',
  [cyberpuerta]:  'cyberpuerta.mx',
  [etsy]:  'etsy.com',
  [soriana]:  'soriana.com',
  [laComer]:  'lacomer.com',
  [sams]:  'sams.com.mx',
  [liverpool]: 'liverpool.com.mx',
  [shasa]: 'shasa.com',
  [fahorro]: 'fahorro.com',
  [officedepot]: 'officedepot.com.mx'
}

const getSiteFromUrl = (url) => {
  for (const [site, siteUrl] of Object.entries(SITE_URL)) {
    if (url.includes(siteUrl)) {
      return site;
    }
  }
  return null;
};

module.exports = {
  SITES,
  SITE_SELECTORS,
  SITE_URL,
  sitesList,
  getSiteFromUrl,
}