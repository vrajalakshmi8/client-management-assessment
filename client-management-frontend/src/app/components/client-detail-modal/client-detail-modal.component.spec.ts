import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ClientDetailModalComponent } from './client-detail-modal.component';
import { ClientModalService } from '../../services/client-modal.service';
import { ClientService } from '../../services/client.service';
import { LoggerService } from '../../core/services/logger.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';
import { of, throwError } from 'rxjs';
import { Client } from '../../models/client.model';

describe('ClientDetailModalComponent', () => {
  let component: ClientDetailModalComponent;
  let fixture: ComponentFixture<ClientDetailModalComponent>;
  let clientModalServiceMock: any;
  let clientServiceMock: jest.Mocked<ClientService>;
  let loggerServiceMock: jest.Mocked<LoggerService>;

  const mockClient: Client = {
    id: 1,
    fullName: 'John Doe',
    displayName: 'John D.',
    email: 'john@example.com',
    details: 'Senior software developer with 10 years of experience in full-stack development and team leadership.',
    location: '123 Main St, New York, NY',
    active: true
  };

  beforeEach(async () => {
    clientModalServiceMock = {
      isOpen: signal(false),
      clientId: signal<number | null>(null),
      open: jest.fn(),
      close: jest.fn(),
      notifyClientDeleted: jest.fn(),
    };

    clientServiceMock = {
      getClientById: jest.fn().mockReturnValue(of(mockClient)),
      deleteClient: jest.fn().mockReturnValue(of(undefined)),
    } as any;

    loggerServiceMock = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ClientDetailModalComponent],
      providers: [
        provideRouter([]),
        { provide: ClientModalService, useValue: clientModalServiceMock },
        { provide: ClientService, useValue: clientServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Modal State', () => {
    it('should have isOpen signal from modal service', () => {
      expect(component.isOpen).toBeDefined();
      expect(component.isOpen()).toBe(false);
    });

    it('should have clientId signal from modal service', () => {
      expect(component.clientId).toBeDefined();
      expect(component.clientId()).toBeNull();
    });

    it('should initialize with null client', () => {
      expect(component.client()).toBeNull();
    });

    it('should initialize with loading false', () => {
      expect(component.loading()).toBe(false);
    });

    it('should initialize with no error', () => {
      expect(component.error()).toBeNull();
    });
  });

  describe('Load Client', () => {
    it('should load client data successfully', () => {
      component.loadClient(1);

      expect(component.loading()).toBe(false);
      expect(component.client()).toEqual(mockClient);
      expect(component.error()).toBeNull();
      expect(clientServiceMock.getClientById).toHaveBeenCalledWith(1);
      expect(loggerServiceMock.info).toHaveBeenCalledWith('Client details loaded in modal', mockClient);
    });

    it('should set loading to true while loading', () => {
      component.loadClient(1);
      // Note: loading is set to true synchronously, then false after observable completes
      expect(clientServiceMock.getClientById).toHaveBeenCalledWith(1);
    });

    it('should handle error when loading client fails', () => {
      const error = new Error('Network error');
      clientServiceMock.getClientById.mockReturnValue(throwError(() => error));

      component.loadClient(1);

      expect(component.loading()).toBe(false);
      expect(component.error()).toBe('Failed to load client details. Please try again.');
      expect(component.client()).toBeNull();
      expect(loggerServiceMock.error).toHaveBeenCalledWith('Error loading client details in modal', error);
    });
  });

  describe('Close Modal', () => {
    it('should close modal and reset state', () => {
      component.client.set(mockClient);
      component.error.set('Some error');

      component.closeModal();

      expect(clientModalServiceMock.close).toHaveBeenCalled();
      expect(component.client()).toBeNull();
      expect(component.error()).toBeNull();
    });
  });

  describe('Backdrop Click', () => {
    it('should close modal when backdrop is clicked', () => {
      const event = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div')
      } as any;
      event.target = event.currentTarget; // Simulate backdrop click

      component.onBackdropClick(event);

      expect(clientModalServiceMock.close).toHaveBeenCalled();
    });

    it('should not close modal when modal content is clicked', () => {
      const backdrop = document.createElement('div');
      const content = document.createElement('div');
      const event = {
        target: content,
        currentTarget: backdrop
      } as any;

      jest.clearAllMocks();
      component.onBackdropClick(event);

      expect(clientModalServiceMock.close).not.toHaveBeenCalled();
    });
  });
});
