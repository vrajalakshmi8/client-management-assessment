import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './http.interceptor';
import { LoggerService } from '../services/logger.service';
import { CustomError, ErrorType } from '../models/error.model';

describe('httpInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
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
        provideHttpClient(withInterceptors([httpInterceptor])),
        provideHttpClientTesting(),
        { provide: LoggerService, useValue: spy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    loggerSpy = TestBed.inject(LoggerService) as jest.Mocked<LoggerService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should pass through successful requests', (done) => {
    const testData = { message: 'success' };

    httpClient.get('/api/test').subscribe({
      next: (data) => {
        expect(data).toEqual(testData);
        done();
      },
      error: () => fail('Should not have failed')
    });

    const req = httpTestingController.expectOne('/api/test');
    req.flush(testData);
  });

  it('should handle 404 errors', (done) => {
    httpClient.get('/api/notfound').subscribe({
      next: () => fail('Should have failed'),
      error: (error: CustomError) => {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toContain('Not Found');
        expect(error.status).toBe(404);
        expect(loggerSpy.error).toHaveBeenCalled();
        done();
      }
    });

    const req = httpTestingController.expectOne('/api/notfound');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 401 unauthorized errors', (done) => {
    httpClient.get('/api/protected').subscribe({
      next: () => fail('Should have failed'),
      error: (error: CustomError) => {
        expect(error.message).toContain('Unauthorized');
        expect(error.status).toBe(401);
        done();
      }
    });

    const req = httpTestingController.expectOne('/api/protected');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle 500 server errors', (done) => {
    httpClient.get('/api/servererror').subscribe({
      next: () => fail('Should have failed'),
      error: (error: CustomError) => {
        expect(error.message).toContain('Internal Server Error');
        expect(error.status).toBe(500);
        expect(error.type).toBe(ErrorType.SERVER);
        done();
      }
    });

    const req = httpTestingController.expectOne('/api/servererror');
    req.flush('Internal error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle network errors', (done) => {
    httpClient.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: (error: CustomError) => {
        expect(error.message).toContain('Network error');
        expect(error.status).toBe(0);
        expect(error.type).toBe(ErrorType.NETWORK);
        done();
      }
    });

    const req = httpTestingController.expectOne('/api/test');
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
  });

  it('should log error details', (done) => {
    httpClient.get('/api/error').subscribe({
      next: () => fail('Should have failed'),
      error: () => {
        expect(loggerSpy.error).toHaveBeenCalled();
        const logCall = loggerSpy.error.mock.calls[0];
        expect(logCall[0]).toContain('HTTP Error Interceptor');
        expect(logCall[1].url).toBe('/api/error');
        expect(logCall[1].method).toBe('GET');
        done();
      }
    });

    const req = httpTestingController.expectOne('/api/error');
    req.flush('Error', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 403 forbidden errors', (done) => {
    httpClient.get('/api/forbidden').subscribe({
      next: () => fail('Should have failed'),
      error: (error: CustomError) => {
        expect(error.message).toContain('Forbidden');
        expect(error.status).toBe(403);
        done();
      }
    });

    const req = httpTestingController.expectOne('/api/forbidden');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });
});
