import { TestBed } from '@angular/core/testing';
import { ClientModalService } from './client-modal.service';

describe('ClientModalService', () => {
  let service: ClientModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientModalService);
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open modal with client ID', () => {
    service.open(123);
    expect(service.isOpen()).toBe(true);
    expect(service.clientId()).toBe(123);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should close modal and reset state', () => {
    service.open(123);
    service.close();
    expect(service.isOpen()).toBe(false);
    expect(service.clientId()).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('should notify client deletion', (done) => {
    service.clientDeleted$.subscribe((id) => {
      expect(id).toBe(999);
      done();
    });
    service.notifyClientDeleted(999);
  });
});
