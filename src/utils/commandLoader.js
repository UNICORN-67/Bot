import fs from 'fs';
import path from 'path';
import logger from './logger.js';

const commandsPath = path.resolve('src', 'commands');

export default function loadCommands(bot) {
  fs.readdir(commandsPath, (err, files) => {
    if (err) {
      logger.error('❌ Failed to read commands directory:', err);
      return;
    }

    files.forEach((file) => {
      if (file.endsWith('.js')) {
        const command = require(path.join(commandsPath, file));
        if (command && typeof command === 'function') {
          try {
            command(bot);
            logger.info(`✅ Loaded command: ${file}`);
          } catch (error) {
            logger.error(`❌ Failed to load command "${file}":`, error);
          }
        } else {
          logger.warn(`⚠️ Skipped invalid command file: ${file}`);
        }
      }
    });
  });
}