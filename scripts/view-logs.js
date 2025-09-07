const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

function viewLogs(logType = 'all') {
  const logFiles = {
    error: path.join(logDir, 'error.log'),
    app: path.join(logDir, 'app.log'),
    debug: path.join(logDir, 'debug.log'),
  };

  if (logType === 'all') {
    console.log('=== ALL LOGS ===\n');

    // Show error logs first
    if (fs.existsSync(logFiles.error)) {
      console.log('--- ERROR LOGS ---');
      console.log(fs.readFileSync(logFiles.error, 'utf8'));
      console.log('\n');
    }

    // Show app logs
    if (fs.existsSync(logFiles.app)) {
      console.log('--- APP LOGS ---');
      console.log(fs.readFileSync(logFiles.app, 'utf8'));
      console.log('\n');
    }

    // Show debug logs
    if (fs.existsSync(logFiles.debug)) {
      console.log('--- DEBUG LOGS ---');
      console.log(fs.readFileSync(logFiles.debug, 'utf8'));
    }
  } else if (logFiles[logType] && fs.existsSync(logFiles[logType])) {
    console.log(`=== ${logType.toUpperCase()} LOGS ===\n`);
    console.log(fs.readFileSync(logFiles[logType], 'utf8'));
  } else {
    console.log(`Log file ${logType}.log not found or doesn't exist.`);
  }
}

function clearLogs() {
  Object.values(logFiles).forEach((logFile) => {
    if (fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '');
      console.log(`Cleared ${path.basename(logFile)}`);
    }
  });
}

function tailLogs(logType = 'app', lines = 20) {
  const logFile = path.join(logDir, `${logType}.log`);

  if (!fs.existsSync(logFile)) {
    console.log(`Log file ${logType}.log not found.`);
    return;
  }

  const content = fs.readFileSync(logFile, 'utf8');
  const logLines = content.split('\n').filter((line) => line.trim());
  const tailLines = logLines.slice(-lines);

  console.log(
    `=== LAST ${lines} LINES FROM ${logType.toUpperCase()} LOG ===\n`,
  );
  tailLines.forEach((line) => console.log(line));
}

// Command line interface
const command = process.argv[2];
const param = process.argv[3];

switch (command) {
  case 'view':
    viewLogs(param || 'all');
    break;
  case 'clear':
    clearLogs();
    break;
  case 'tail':
    tailLogs(param || 'app', parseInt(process.argv[4]) || 20);
    break;
  default:
    console.log(`
Usage: node scripts/view-logs.js <command> [options]

Commands:
  view [type]     - View logs (all, error, app, debug)
  clear           - Clear all log files
  tail [type] [lines] - Show last N lines (default: 20)

Examples:
  node scripts/view-logs.js view all
  node scripts/view-logs.js view error
  node scripts/view-logs.js tail app 50
  node scripts/view-logs.js clear
    `);
}
