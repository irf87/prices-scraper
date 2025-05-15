const parseParams = require('../../middleware/parseParams');
const express = require('express');
const router = express.Router();
router.use(parseParams);

const CL_TelegramBot = require('../../utils/notifications/telegramBot');
const Locale = require('../../utils/locale');
const t = new Locale().getLocale();

router.get('/', (req, res) => {
	console.log('Test route accessed');
	res.send({message: 'Server is working!'});
});

router.get('/telegram', (req, res) => {
  if (process.env.ENABLE_NOTIFICATIONS !== 'true') {
    return res.status(400).json({
      error: 'Las notificaciones no están habilitadas',
      message: 'Configure ENABLE_NOTIFICATIONS=true para activar las notificaciones'
    });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_BOT_CHAT_ID) {
    return res.status(400).json({
      error: 'Configuración de Telegram incompleta',
      message: 'Configure TELEGRAM_BOT_TOKEN y TELEGRAM_BOT_CHAT_ID para activar las notificaciones de Telegram'
    });
  }

  try {
    const telegramBot = new CL_TelegramBot();
    const testMessage = t('TELEGRAM_TEST');
    telegramBot.send(testMessage);
    
    res.json({
      success: true,
      message: 'Notificación de prueba enviada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al enviar la notificación de prueba',
      message: error.message
    });
  }
});

module.exports = router;
