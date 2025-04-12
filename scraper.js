require('dotenv').config();

const SCRAPPER_INTERVAL = process.env.SCRAPPER_INTERVAL_TIME;
const SCRAPPER_INTERVAL_UNIT = process.env.SCRAPPER_INTERVAL_UNIT;

const { Worker } = require('worker_threads');
const GETTING_MODE_TYPES = require('./utils/gettingModeTypes');

const { parseToMiliseconds } = require('./utils/time');

function execute() {
  // Create worker for FETCH mode
  const fetchWorker = new Worker('./worker.js');
  fetchWorker.postMessage(GETTING_MODE_TYPES.FETCH);
  fetchWorker.on('message', (message) => {
    if (message === 'done') {
      console.log('fetchWorker done');
      fetchWorker.terminate();
    }
  });
  fetchWorker.on('error', (error) => {
    console.error('Error in FETCH worker:', error);
    fetchWorker.terminate();
  });

  // Create worker for RENDER mode
  const renderWorker = new Worker('./worker.js');
  renderWorker.postMessage(GETTING_MODE_TYPES.RENDER);
  renderWorker.on('message', (message) => {
    if (message === 'done') {
      console.log('renderWorker done');
      renderWorker.terminate();
    }
  });
  renderWorker.on('error', (error) => {
    console.error('Error in RENDER worker:', error);
    renderWorker.terminate();
  });
}

execute();
setInterval(execute, parseToMiliseconds(SCRAPPER_INTERVAL, SCRAPPER_INTERVAL_UNIT));
