import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a success notification', () => {
    service.success('Test success message');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].type).toBe('success');
    expect(service.notifications()[0].message).toBe('Test success message');
  });

  it('should add an error notification', () => {
    service.error('Test error message');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].type).toBe('error');
    expect(service.notifications()[0].message).toBe('Test error message');
  });

  it('should add an info notification', () => {
    service.info('Test info message');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].type).toBe('info');
  });

  it('should add a warning notification', () => {
    service.warning('Test warning message');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].type).toBe('warning');
  });

  it('should remove a notification by id', () => {
    service.success('Test message 1');
    service.success('Test message 2');
    expect(service.notifications().length).toBe(2);

    const firstId = service.notifications()[0].id;
    service.remove(firstId);
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('Test message 2');
  });

  it('should clear all notifications', () => {
    service.success('Message 1');
    service.error('Message 2');
    service.info('Message 3');
    expect(service.notifications().length).toBe(3);

    service.clear();
    expect(service.notifications().length).toBe(0);
  });

  it('should auto-remove notification after duration', (done) => {
    jest.useFakeTimers();
    service.success('Test message', 1000);
    expect(service.notifications().length).toBe(1);

    jest.advanceTimersByTime(1000);
    expect(service.notifications().length).toBe(0);
    
    jest.useRealTimers();
    done();
  });

  it('should handle multiple notifications', () => {
    service.success('Success message');
    service.error('Error message');
    service.warning('Warning message');
    
    expect(service.notifications().length).toBe(3);
    expect(service.notifications()[0].type).toBe('success');
    expect(service.notifications()[1].type).toBe('error');
    expect(service.notifications()[2].type).toBe('warning');
  });
});
