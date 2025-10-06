const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

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

const logFiles = {
  error: {
    path: path.join(logDir, 'error.log'),
    label: 'ERROR',
    color: colors.red,
  },
  app: {
    path: path.join(logDir, 'app.log'),
    label: 'APP',
    color: colors.green,
  },
  debug: {
    path: path.join(logDir, 'debug.log'),
    label: 'DEBUG',
    color: colors.cyan,
  },
};

// Track file positions to read only new content
const filePositions = {};

function ensureLogFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    // Create the file if it doesn't exist
    fs.writeFileSync(filePath, '');
  }
}

function readNewLines(logType, logInfo) {
  try {
    ensureLogFileExists(logInfo.path);

    const stats = fs.statSync(logInfo.path);
    const currentPosition = filePositions[logType] || 0;

    // If file was truncated or is new
    if (stats.size < currentPosition) {
      filePositions[logType] = 0;
      return;
    }

    // If no new content
    if (stats.size === currentPosition) {
      return;
    }

    // Read new content
    const stream = fs.createReadStream(logInfo.path, {
      start: currentPosition,
      encoding: 'utf8',
    });

    let buffer = '';
    stream.on('data', (chunk) => {
      buffer += chunk;
    });

    stream.on('end', () => {
      if (buffer.trim()) {
        const lines = buffer.split('\n');
        lines.forEach((line) => {
          if (line.trim()) {
            console.log(
              `${logInfo.color}[${logInfo.label}]${colors.reset} ${line}`,
            );
          }
        });
      }
      filePositions[logType] = stats.size;
    });
  } catch (error) {
    // Ignore errors for files that don't exist yet
  }
}

function watchLogs() {
  console.log(
    `${colors.bright}${colors.magenta}===============================================${colors.reset}`,
  );
  console.log(
    `${colors.bright}${colors.magenta}   🐰 Rabbit Backend - Live Log Viewer 🐰${colors.reset}`,
  );
  console.log(
    `${colors.bright}${colors.magenta}===============================================${colors.reset}\n`,
  );
  console.log(
    `${colors.yellow}Watching log files for changes...${colors.reset}`,
  );
  console.log(`${colors.yellow}Press Ctrl+C to stop${colors.reset}\n`);

  // Initialize file positions to end of file (so we only see new logs)
  Object.keys(logFiles).forEach((logType) => {
    const logInfo = logFiles[logType];
    ensureLogFileExists(logInfo.path);
    try {
      const stats = fs.statSync(logInfo.path);
      filePositions[logType] = stats.size;
    } catch (error) {
      filePositions[logType] = 0;
    }
  });

  // Watch all log files
  Object.keys(logFiles).forEach((logType) => {
    const logInfo = logFiles[logType];

    fs.watch(logInfo.path, (eventType) => {
      if (eventType === 'change') {
        readNewLines(logType, logInfo);
      }
    });

    console.log(
      `${logInfo.color}✓ Watching ${logInfo.label} logs${colors.reset}`,
    );
  });

  console.log('\n');

  // Also check periodically for any missed updates
  setInterval(() => {
    Object.keys(logFiles).forEach((logType) => {
      readNewLines(logType, logFiles[logType]);
    });
  }, 1000);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n\n${colors.yellow}Stopping log watcher...${colors.reset}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`\n\n${colors.yellow}Stopping log watcher...${colors.reset}`);
  process.exit(0);
});

// Start watching
watchLogs();
