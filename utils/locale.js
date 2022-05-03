const { I18n } = require('i18n');
const path = require('path');

class Locale  {
  constructor(defaultLocale = 'es') {
    this.i18n = new I18n();
    this.i18n.configure({
      // setup some locales - other locales default to en silently
      locales: ['es', 'en'],
      defaultLocale,
      directory: `${path.resolve()}/locales/`,
    });
  }

  getLocale() {
    return this.i18n.__;
  }
}

module.exports = Locale;


