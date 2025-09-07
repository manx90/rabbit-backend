# Logging System Documentation

## Overview

The application now includes a comprehensive file-based logging system that saves logs to files for better debugging and monitoring, especially useful for cPanel deployments where console logs might not be easily accessible.

## Log Files

The logging system creates three types of log files in the `logs/` directory:

- **`error.log`** - Contains all error messages and stack traces
- **`app.log`** - Contains general application logs, warnings, and info messages
- **`debug.log`** - Contains detailed debug information

## Log Format

Each log entry follows this format:

```
2024-01-15T10:30:45.123Z [ERROR] [ProductController] Error message
Stack: Error stack trace here
```

## Available NPM Scripts

### View Logs

```bash
# View all logs
npm run logs:view

# View specific log types
npm run logs:error    # View only error logs
npm run logs:app      # View only application logs
npm run logs:debug    # View only debug logs

# View last 50 lines of app logs
npm run logs:tail
```

### Manage Logs

```bash
# Clear all log files
npm run logs:clear
```

## Manual Log Viewing

You can also use the log viewer script directly:

```bash
# View all logs
node scripts/view-logs.js view all

# View specific log type
node scripts/view-logs.js view error

# Show last 20 lines of app logs
node scripts/view-logs.js tail app 20

# Clear all logs
node scripts/view-logs.js clear
```

## Logging in Code

The `LoggerService` provides several methods for different log levels:

```typescript
// Basic logging
this.logger.log('General message', 'Context');
this.logger.info('Information message', 'Context');
this.logger.warn('Warning message', 'Context');
this.logger.error('Error message', 'Context', 'Stack trace');
this.logger.debug('Debug message', 'Context');

// Specialized logging
this.logger.logApiRequest('GET', '/api/products', query, body, 'Controller');
this.logger.logApiResponse('GET', '/api/products', 200, 150, 'Controller');
this.logger.logDatabaseOperation('SELECT', 'products', { query }, 'Repository');
this.logger.logError(error, 'Context', { additionalInfo });
```

## Debugging 500 Errors

When you encounter a 500 error on cPanel:

1. **Check the error logs:**

   ```bash
   npm run logs:error
   ```

2. **Check the application logs:**

   ```bash
   npm run logs:app
   ```

3. **Check debug logs for detailed information:**

   ```bash
   npm run logs:debug
   ```

4. **View recent activity:**
   ```bash
   npm run logs:tail
   ```

## Log File Locations

- **Local Development:** `./logs/`
- **cPanel Deployment:** `./logs/` (relative to your application root)

## Log Rotation

The logging system includes a method to clean old logs:

```typescript
// Clean logs older than 7 days (default)
this.logger.cleanOldLogs();

// Clean logs older than 30 days
this.logger.cleanOldLogs(30);
```

## Example Log Output

### Error Log (error.log)

```
2024-01-15T10:30:45.123Z [ERROR] [ProductController] Error in getAllProducts
Stack: TypeError: Cannot read property 'find' of undefined
    at ProductCrud.getAllProducts (src/product/product.crud.ts:225:15)
    at ProductController.getAllProducts (src/product/product.controller.ts:43:7)
```

### Application Log (app.log)

```
2024-01-15T10:30:45.123Z [INFO] [Bootstrap] Starting application bootstrap...
2024-01-15T10:30:45.456Z [INFO] [Bootstrap] Application created successfully
2024-01-15T10:30:45.789Z [INFO] [Bootstrap] Starting server...
2024-01-15T10:30:45.890Z [INFO] [Bootstrap] Application is running on: http://0.0.0.0:3000
2024-01-15T10:30:46.123Z [INFO] [API] API Request: GET /product | Query: {"page":"1","limit":"10"}
2024-01-15T10:30:46.456Z [INFO] [API] API Response: GET /product | Status: 200 | Time: 333ms
```

### Debug Log (debug.log)

```
2024-01-15T10:30:46.123Z [DEBUG] [ProductCrud] Starting getAllProducts with query: {"page":"1","limit":"10"}
2024-01-15T10:30:46.124Z [DEBUG] [ProductCrud] Query builder created successfully
2024-01-15T10:30:46.125Z [DEBUG] [ProductCrud] ApiFeatures applied successfully
2024-01-15T10:30:46.200Z [DEBUG] [ProductCrud] Data transformation completed
```

## Troubleshooting

### No Logs Appearing

1. Check if the `logs/` directory exists
2. Verify file permissions
3. Check if the application is actually running

### Logs Too Verbose

- Adjust log levels in your code
- Use `debug()` for detailed information only
- Use `info()` for important events
- Use `error()` for actual errors

### Log Files Too Large

- Use the log rotation feature
- Clear logs regularly with `npm run logs:clear`
- Consider implementing log file size limits

## Integration with cPanel

For cPanel deployments, the logs will be saved in your application directory under `logs/`. You can:

1. Access logs via cPanel File Manager
2. Download log files for analysis
3. Use SSH (if available) to run the log viewing commands
4. Set up log monitoring scripts

This logging system will help you identify and debug the 500 error you're experiencing on cPanel by providing detailed information about what's happening when the error occurs.
