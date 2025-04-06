const jsdom = require('jsdom');
const { chromium } = require('playwright');
const { JSDOM } = jsdom;

const TIMEOUT_WAIT_FRAMEWORK = 500;

const getHtmlByRender = async (url) => {
  let browser;
  let data;
  let error;
  
  try {
    // Launch browser with specific options to avoid detection
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-site-isolation-trials',
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-features=BlockInsecurePrivateNetworkRequests',
        '--disable-features=CrossSiteDocumentBlockingAlways',
        '--disable-features=CrossSiteDocumentBlockingIfIsolating'
      ]
    });
    
    // Create a context with specific user agent and viewport
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      locale: 'es-MX',
      timezoneId: 'America/Mexico_City',
      geolocation: { longitude: -99.1332, latitude: 19.4326 }, // Mexico City coordinates
      permissions: ['geolocation'],
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    // Add script to modify navigator properties to avoid detection
    await context.addInitScript(() => {
      // Override the navigator properties that are used for detection
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['es-MX', 'es', 'en'] });
      
      // Add a fake Chrome runtime
      window.chrome = {
        runtime: {},
        app: {},
        loadTimes: function() {},
        csi: function() {},
        webstore: {}
      };
    });
    
    const page = await context.newPage();
    
    // Navigate to the URL with specific options
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 60000 // Increase timeout to 60 seconds
    });
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    
    // Esperar a que el contenido dinámico se cargue
    // Para Next.js
    try {
      await page.waitForSelector('#__next', { timeout: TIMEOUT_WAIT_FRAMEWORK });
    } catch (e) {
      console.log('No se encontró el selector de Next.js, continuando...');
    }
    
    // Para React
    try {
      await page.waitForSelector('[data-reactroot]', { timeout: TIMEOUT_WAIT_FRAMEWORK });
    } catch (e) {
      console.log('No se encontró el selector de React, continuando...');
    }
    
    // Para Angular
    try {
      await page.waitForSelector('app-root', { timeout: TIMEOUT_WAIT_FRAMEWORK });
    } catch (e) {
      console.log('No se encontró el selector de Angular, continuando...');
    }
    
    // Esperar a que no haya más peticiones de red activas
    await page.waitForLoadState('networkidle');
    
    // Esperar a que cualquier animación o transición termine
    await page.waitForTimeout(TIMEOUT_WAIT_FRAMEWORK / 2);
    
  
    data = await page.content();
    
    console.log('Page loaded successfully');
  } catch(err) {
    console.log('error in getHtmlByRender', err);
    error = err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return { data, error };
}

module.exports = getHtmlByRender;