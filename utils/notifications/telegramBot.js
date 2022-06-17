const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const ownChatId = process.env.TELEGRAM_BOT_CHAT_ID;

class CL_TelegramBot {
  constructor() {
    this.bot = new TelegramBot(token, { polling: true });
  }

  send(msg = '') {
    this.bot.sendMessage(ownChatId, msg, { parse_mode: 'Markdown', disable_web_page_preview: false });
  }

  stop() {
    if(this.bot.isPolling()) {
      this.bot.stopPolling();
    }
    this.bot.close();
  }
}

module.exports = CL_TelegramBot;