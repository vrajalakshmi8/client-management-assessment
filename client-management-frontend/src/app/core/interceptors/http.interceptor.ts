import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { ErrorType, CustomError } from '../models/error.model';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      let errorType = ErrorType.UNKNOWN;

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
        errorType = ErrorType.CLIENT;
      } else {
        // Server-side error
        errorType = ErrorType.SERVER;
        
        switch (error.status) {
          case 0:
            errorMessage = 'Network error - please check your connection';
            errorType = ErrorType.NETWORK;
            break;
          case 400:
            errorMessage = 'Bad Request: ' + (error.error?.message || 'Invalid request');
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in';
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission';
            break;
          case 404:
            errorMessage = 'Not Found: The requested resource was not found';
            break;
          case 500:
            errorMessage = 'Internal Server Error: Please try again later';
            break;
          case 503:
            errorMessage = 'Service Unavailable: Please try again later';
            break;
          default:
            errorMessage = `Server Error ${error.status}: ${error.message}`;
        }
      }

      // Log the error
      logger.error('HTTP Error Interceptor:', {
        url: req.url,
        method: req.method,
        status: error.status,
        message: errorMessage,
        error: error.error
      });

      // Create and throw custom error
      const customError = new CustomError(errorMessage, errorType, error.status);
      return throwError(() => customError);
    })
  );
};
