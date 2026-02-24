import { ErrorHandler, Injectable, inject } from '@angular/core';
import { LoggerService } from './logger.service';
import { AppError, ErrorType } from '../models/error.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);

  handleError(error: Error): void {
    const appError = this.parseError(error);
    
    this.logger.error('Global Error Handler:', {
      message: appError.message,
      status: appError.status,
      statusText: appError.statusText,
      timestamp: appError.timestamp,
      url: appError.url,
      stack: appError.stack
    });
    this.notifyUser(appError);
  }

  private parseError(error: any): AppError {
    const appError: AppError = {
      message: 'An unexpected error occurred',
      timestamp: new Date()
    };

    if (error instanceof Error) {
      appError.message = error.message;
      appError.stack = error.stack;
    } else if (typeof error === 'string') {
      appError.message = error;
    } else if (error && error.message) {
      appError.message = error.message;
    }
    
    if (error.status) {
      appError.status = error.status;
    }
    if (error.statusText) {
      appError.statusText = error.statusText;
    }
    if (error.url) {
      appError.url = error.url;
    }

    return appError;
  }

  private notifyUser(error: AppError): void {
    console.error('User notification:', error.message);
  }
}
