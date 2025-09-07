import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService {
  private readonly logDir = path.join(process.cwd(), 'logs');
  private readonly errorLogFile = path.join(this.logDir, 'error.log');
  private readonly appLogFile = path.join(this.logDir, 'app.log');
  private readonly debugLogFile = path.join(this.logDir, 'debug.log');

  constructor() {
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatLogMessage(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    const stackStr = stack ? `\nStack: ${stack}` : '';
    return `${timestamp} [${level}]${contextStr} ${message}${stackStr}\n`;
  }

  private writeToFile(filePath: string, message: string): void {
    try {
      fs.appendFileSync(filePath, message);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  log(message: string, context?: string): void {
    const formattedMessage = this.formatLogMessage('LOG', message, context);
    console.log(message);
    this.writeToFile(this.appLogFile, formattedMessage);
  }

  error(message: string, context?: string, stack?: string): void {
    const formattedMessage = this.formatLogMessage(
      'ERROR',
      message,
      context,
      stack,
    );
    console.error(message);
    this.writeToFile(this.errorLogFile, formattedMessage);
  }

  warn(message: string, context?: string): void {
    const formattedMessage = this.formatLogMessage('WARN', message, context);
    console.warn(message);
    this.writeToFile(this.appLogFile, formattedMessage);
  }

  debug(message: string, context?: string): void {
    const formattedMessage = this.formatLogMessage('DEBUG', message, context);
    console.debug(message);
    this.writeToFile(this.debugLogFile, formattedMessage);
  }

  info(message: string, context?: string): void {
    const formattedMessage = this.formatLogMessage('INFO', message, context);
    console.info(message);
    this.writeToFile(this.appLogFile, formattedMessage);
  }

  // Method to log API requests and responses
  logApiRequest(
    method: string,
    url: string,
    query?: any,
    body?: any,
    context?: string,
  ): void {
    const message = `API Request: ${method} ${url}${query ? ` | Query: ${JSON.stringify(query)}` : ''}${body ? ` | Body: ${JSON.stringify(body)}` : ''}`;
    this.info(message, context || 'API');
  }

  logApiResponse(
    method: string,
    url: string,
    statusCode: number,
    responseTime?: number,
    context?: string,
  ): void {
    const message = `API Response: ${method} ${url} | Status: ${statusCode}${responseTime ? ` | Time: ${responseTime}ms` : ''}`;
    this.info(message, context || 'API');
  }

  // Method to log database operations
  logDatabaseOperation(
    operation: string,
    table: string,
    details?: any,
    context?: string,
  ): void {
    const message = `DB Operation: ${operation} on ${table}${details ? ` | Details: ${JSON.stringify(details)}` : ''}`;
    this.debug(message, context || 'DATABASE');
  }

  // Method to log errors with full context
  logError(error: Error, context?: string, additionalInfo?: any): void {
    const message = `Error: ${error.message}${additionalInfo ? ` | Info: ${JSON.stringify(additionalInfo)}` : ''}`;
    this.error(message, context, error.stack);
  }

  // Method to clean old log files (optional)
  cleanOldLogs(daysToKeep: number = 7): void {
    try {
      const files = fs.readdirSync(this.logDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      files.forEach((file) => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);

        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          this.info(`Deleted old log file: ${file}`, 'LOGGER');
        }
      });
    } catch (error) {
      this.error('Failed to clean old logs', 'LOGGER', error.stack);
    }
  }
}
