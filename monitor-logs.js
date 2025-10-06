const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
const logFiles = {
  error: path.join(logDir, 'error.log'),
  app: path.join(logDir, 'app.log'),
  debug: path.join(logDir, 'debug.log'),
};

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

console.log(`${colors.cyan}📋 Rabbit Backend Log Monitor${colors.reset}`);
console.log(
  `${colors.yellow}Monitoring log files for new entries...${colors.reset}\n`,
);

// Track file positions to read only new content
const filePositions = {};

function ensureLogFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }
}

function readNewLines(logType, logInfo) {
  try {
    ensureLogFileExists(logInfo.path);

    const stats = fs.statSync(logInfo.path);
    const currentSize = stats.size;
    const lastPosition = filePositions[logType] || 0;

    if (currentSize > lastPosition) {
      const stream = fs.createReadStream(logInfo.path, { start: lastPosition });
      let buffer = '';

      stream.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep the last incomplete line in buffer

        lines.forEach((line) => {
          if (line.trim()) {
            const color = logInfo.color || colors.white;
            console.log(`${color}[${logInfo.label}]${colors.reset} ${line}`);
          }
        });
      });

      filePositions[logType] = currentSize;
    }
  } catch (error) {
    console.error(`Error reading ${logType} log:`, error.message);
  }
}

// Initialize file positions
Object.keys(logFiles).forEach((logType) => {
  const logPath = logFiles[logType];
  if (fs.existsSync(logPath)) {
    const stats = fs.statSync(logPath);
    filePositions[logType] = stats.size;
  }
});

// Monitor each log file
const monitors = {
  error: { path: logFiles.error, label: 'ERROR', color: colors.red },
  app: { path: logFiles.app, label: 'APP  ', color: colors.green },
  debug: { path: logFiles.debug, label: 'DEBUG', color: colors.cyan },
};

// Check for new log entries every second
setInterval(() => {
  Object.keys(monitors).forEach((logType) => {
    readNewLines(logType, monitors[logType]);
  });
}, 1000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Log monitoring stopped.${colors.reset}`);
  process.exit(0);
});

console.log(
  `${colors.green}✅ Log monitoring started. Press Ctrl+C to stop.${colors.reset}\n`,
);
