import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './global-error-handler.service';
import { LoggerService } from './logger.service';
import { ErrorType, CustomError } from '../models/error.model';

describe('GlobalErrorHandler', () => {
  let errorHandler: GlobalErrorHandler;
  let loggerSpy: jest.Mocked<LoggerService>;

  beforeEach(() => {
    const spy = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      setLogLevel: jest.fn()
    } as unknown as jest.Mocked<LoggerService>;
    
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: LoggerService, useValue: spy }
      ]
    });
    
    errorHandler = TestBed.inject(GlobalErrorHandler);
    loggerSpy = TestBed.inject(LoggerService) as jest.Mocked<LoggerService>;
  });

  it('should be created', () => {
    expect(errorHandler).toBeTruthy();
  });

  it('should handle standard Error objects', () => {
    const testError = new Error('Test error message');
    
    errorHandler.handleError(testError);
    
    expect(loggerSpy.error).toHaveBeenCalled();
    const logCall = loggerSpy.error.mock.calls[loggerSpy.error.mock.calls.length - 1];
    expect(logCall[0]).toContain('Global Error Handler');
    expect(logCall[1].message).toBe('Test error message');
  });

  it('should handle string errors', () => {
    const testError = 'String error message';
    
    errorHandler.handleError(testError as any);
    
    expect(loggerSpy.error).toHaveBeenCalled();
    const logCall = loggerSpy.error.mock.calls[loggerSpy.error.mock.calls.length - 1];
    expect(logCall[1].message).toBe('String error message');
  });

  it('should handle CustomError objects', () => {
    const customError = new CustomError('Custom error', ErrorType.SERVER, 500);
    
    errorHandler.handleError(customError);
    
    expect(loggerSpy.error).toHaveBeenCalled();
    const logCall = loggerSpy.error.mock.calls[loggerSpy.error.mock.calls.length - 1];
    expect(logCall[1].message).toBe('Custom error');
  });

  it('should include timestamp in error logs', () => {
    const testError = new Error('Test error');
    
    errorHandler.handleError(testError);
    
    const logCall = loggerSpy.error.mock.calls[loggerSpy.error.mock.calls.length - 1];
    expect(logCall[1].timestamp).toBeInstanceOf(Date);
  });

  it('should handle errors with status codes', () => {
    const httpError = new Error('HTTP Error') as any;
    httpError.status = 404;
    httpError.statusText = 'Not Found';
    httpError.url = '/api/test';
    
    errorHandler.handleError(httpError);
    
    const logCall = loggerSpy.error.mock.calls[loggerSpy.error.mock.calls.length - 1];
    expect(logCall[1].status).toBe(404);
    expect(logCall[1].statusText).toBe('Not Found');
    expect(logCall[1].url).toBe('/api/test');
  });

  it('should handle unknown error types', () => {
    const unknownError = { someProperty: 'some value' };
    
    errorHandler.handleError(unknownError as any);
    
    expect(loggerSpy.error).toHaveBeenCalled();
    const logCall = loggerSpy.error.mock.calls[loggerSpy.error.mock.calls.length - 1];
    expect(logCall[1].message).toBe('An unexpected error occurred');
  });
});
