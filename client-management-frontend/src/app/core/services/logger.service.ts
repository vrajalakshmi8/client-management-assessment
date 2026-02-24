import { Injectable } from '@angular/core';

export enum LogLevel {
  Error = 0,
  Warning = 1,
  Info = 2,
  Debug = 3
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = LogLevel.Debug;

  constructor() {
    // Set log level based on environment
    // In production, you might want to set it to Error or Warning only
  }

  error(message: string, ...optionalParams: any[]): void {
    if (this.logLevel >= LogLevel.Error) {
      console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]): void {
    if (this.logLevel >= LogLevel.Warning) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...optionalParams);
    }
  }

  info(message: string, ...optionalParams: any[]): void {
    if (this.logLevel >= LogLevel.Info) {
      console.info(`[INFO] ${new Date().toISOString()}: ${message}`, ...optionalParams);
    }
  }

  debug(message: string, ...optionalParams: any[]): void {
    if (this.logLevel >= LogLevel.Debug) {
      console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`, ...optionalParams);
    }
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}
