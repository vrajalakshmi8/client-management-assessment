import { TestBed } from '@angular/core/testing';
import { ConfirmationModalService } from './confirmation-modal.service';

describe('ConfirmationModalService', () => {
  let service: ConfirmationModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open modal with options and cancel', async () => {
    const promise = service.open({
      title: 'Test Title',
      message: 'Test Message',
      confirmText: 'Yes',
      cancelText: 'No'
    });

    expect(service.isOpen()).toBe(true);
    expect(service.title()).toBe('Test Title');
    expect(service.message()).toBe('Test Message');

    service.cancel();
    const result = await promise;
    expect(result).toBe(false);
    expect(service.isOpen()).toBe(false);
  });

  it('should open modal and confirm', async () => {
    const promise = service.open({
      title: 'Test',
      message: 'Message'
    });

    service.confirm();
    const result = await promise;

    expect(result).toBe(true);
    expect(service.isOpen()).toBe(false);
  });

  it('should use default button text', async () => {
    const promise = service.open({
      title: 'Test',
      message: 'Message'
    });

    expect(service.confirmText()).toBe('Confirm');
    expect(service.cancelText()).toBe('Cancel');

    service.cancel();
    await promise;
  });
});
