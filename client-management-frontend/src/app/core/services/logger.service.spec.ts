import { TestBed } from '@angular/core/testing';
import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);

    // Ensure console methods exist before spying
    if (!console.error) console.error = (...args: any[]) => {};
    if (!console.warn) console.warn = (...args: any[]) => {};
    if (!console.info) console.info = (...args: any[]) => {};
    if (!console.log) console.log = (...args: any[]) => {};

    // Spy on console methods using Jest
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('error logging', () => {
    it('should log error messages', () => {
      service.error('Test error message');
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Test error message');
    });

    it('should include timestamp in error logs', () => {
      service.error('Test error');
      const logMessage = consoleErrorSpy.mock.calls[0][0];
      expect(logMessage).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should log error with additional parameters', () => {
      const errorObj = { code: 500, details: 'Internal error' };
      service.error('Server error', errorObj);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Server error'),
        errorObj
      );
    });
  });

  describe('warn logging', () => {
    it('should log warning messages', () => {
      service.warn('Test warning');
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN]');
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('Test warning');
    });
  });

  describe('info logging', () => {
    it('should log info messages', () => {
      service.info('Test info');
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleInfoSpy.mock.calls[0][0]).toContain('[INFO]');
      expect(consoleInfoSpy.mock.calls[0][0]).toContain('Test info');
    });
  });

  describe('debug logging', () => {
    it('should log debug messages', () => {
      service.debug('Test debug');
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('[DEBUG]');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Test debug');
    });
  });

  describe('log level control', () => {
    it('should respect log level settings', () => {
      service.setLogLevel(LogLevel.Error);
      
      service.debug('Debug message');
      service.info('Info message');
      service.warn('Warning message');
      service.error('Error message');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log warnings and errors when log level is Warning', () => {
      service.setLogLevel(LogLevel.Warning);
      
      service.debug('Debug message');
      service.info('Info message');
      service.warn('Warning message');
      service.error('Error message');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
