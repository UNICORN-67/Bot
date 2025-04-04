require('dotenv').config();
const logger = require('./src/utils/logger');

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

// Start bot
try {
  require('./src/bot'); // main bot logic
} catch (err) {
  logger.error('Error loading bot:', err);
}