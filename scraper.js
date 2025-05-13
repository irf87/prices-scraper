require('dotenv').config();

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Prevent process from exiting on uncaught errors
process.on('exit', (code) => {
  console.log(`Process about to exit with code: ${code}`);
  // Only attempt to restart if it's not a manual termination
  if (code !== 0 && !process.manualShutdown) {
    console.log('Attempting to restart process...');
    require('child_process').spawn(process.argv[0], process.argv.slice(1), {
      detached: true,
      stdio: 'inherit'
    });
  }
});

const SCRAPPER_INTERVAL = process.env.SCRAPPER_INTERVAL_TIME;
const SCRAPPER_INTERVAL_UNIT = process.env.SCRAPPER_INTERVAL_UNIT;

const { Worker } = require('worker_threads');
const GETTING_MODE_TYPES = require('./utils/gettingModeTypes');

const { parseToMiliseconds } = require('./utils/time');

// Keep track of active workers
let activeWorkers = new Set();
let isExecuting = false;
let intervalId;

function cleanupWorker(worker) {
  try {
    if (worker && !worker.isTerminated) {
      worker.terminate();
      worker.unref();
      activeWorkers.delete(worker);
    }
  } catch (error) {
    console.error('Error cleaning up worker:', error);
  }
}

function createWorker(mode) {
  try {
    const worker = new Worker('./worker.js', {
      resourceLimits: {
        maxOldGenerationSizeMb: 512,
        maxYoungGenerationSizeMb: 256,
        codeRangeSizeMb: 64
      }
    });
    
    worker.unref(); // Prevent worker from keeping the process alive
    activeWorkers.add(worker);

    worker.on('message', (message) => {
      if (message === 'done') {
        console.log(`${mode} worker done`);
        cleanupWorker(worker);
      }
    });

    worker.on('error', (error) => {
      console.error(`Error in ${mode} worker:`, error);
      cleanupWorker(worker);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`${mode} worker stopped with exit code ${code}`);
      }
      cleanupWorker(worker);
    });

    worker.postMessage(mode);
    return worker;
  } catch (error) {
    console.error(`Error creating ${mode} worker:`, error);
    return null;
  }
}

function execute() {
  if (isExecuting) {
    console.log('Previous execution still running, skipping...');
    return;
  }

  try {
    isExecuting = true;
    
    // Cleanup any existing workers
    activeWorkers.forEach(worker => cleanupWorker(worker));
    activeWorkers.clear();

    // Create new workers
    createWorker(GETTING_MODE_TYPES.FETCH);
    createWorker(GETTING_MODE_TYPES.RENDER);
  } catch (error) {
    console.error('Error in execute function:', error);
  } finally {
    isExecuting = false;
  }
}

// Cleanup function for graceful shutdown
async function cleanup() {
  console.log('Cleaning up workers...');
  activeWorkers.forEach(worker => cleanupWorker(worker));
  activeWorkers.clear();
  
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  // Give workers a moment to clean up
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  process.exit(0);
}

// Handle process termination
process.on('SIGTERM', () => {
  process.manualShutdown = true;
  cleanup();
});

process.on('SIGINT', () => {
  process.manualShutdown = true;
  cleanup();
});

// Wrap the initial execution in try-catch
try {
  execute();
} catch (error) {
  console.error('Error in initial execution:', error);
}

// Wrap the interval in try-catch
try {
  intervalId = setInterval(() => {
    try {
      execute();
    } catch (error) {
      console.error('Error in interval execution:', error);
    }
  }, parseToMiliseconds(SCRAPPER_INTERVAL, SCRAPPER_INTERVAL_UNIT));
} catch (error) {
  console.error('Error setting up interval:', error);
}

// Keep the process alive
setInterval(() => {
  if (process.memoryUsage().heapUsed > 1024 * 1024 * 1024) { // 1GB
    console.log('Memory usage too high, cleaning up...');
    global.gc && global.gc();
  }
}, 30000);
