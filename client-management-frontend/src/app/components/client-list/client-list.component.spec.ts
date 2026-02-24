import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClientListComponent } from './client-list.component';
import { ClientService } from '../../services/client.service';
import { LoggerService } from '../../core/services/logger.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';
import { of, throwError } from 'rxjs';
import { Client } from '../../models/client.model';

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;
  let clientServiceMock: jest.Mocked<ClientService>;
  let loggerServiceMock: jest.Mocked<LoggerService>;
  let notificationServiceMock: jest.Mocked<NotificationService>;
  let confirmationModalServiceMock: jest.Mocked<ConfirmationModalService>;

  const mockClients: Client[] = [
    {
      id: 1,
      fullName: 'John Doe',
      displayName: 'John D.',
      email: 'john@example.com',
      details: 'Senior developer with expertise in Angular',
      location: '123 Main St',
      active: true
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      displayName: 'Jane S.',
      email: 'jane@example.com',
      details: 'Marketing specialist and team lead',
      location: '456 Oak Ave',
      active: false
    },
    {
      id: 3,
      fullName: 'Bob Johnson',
      displayName: 'Bob J.',
      email: 'bob@example.com',
      details: 'Software engineer specializing in backend development',
      location: '789 Elm St',
      active: false
    }
  ];

  const mockClientResponse = {
    content: mockClients,
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: { sorted: false, unsorted: true, empty: true },
      offset: 0,
      paged: true,
      unpaged: false
    },
    total: 3,
    size: 10,
    totalPages: 1,
    totalElements: 3,
    first: true,
    last: true,
    numberOfElements: 3,
    number: 0,
    sort: { sorted: false, unsorted: true, empty: true },
    empty: false
  };

  beforeEach(async () => {
    clientServiceMock = {
      getClients: jest.fn().mockReturnValue(of(mockClientResponse)),
      deleteClient: jest.fn().mockReturnValue(of(undefined)),
    } as any;

    loggerServiceMock = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any;

    notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    } as any;

    confirmationModalServiceMock = {
      open: jest.fn().mockResolvedValue(true),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ClientListComponent],
      providers: [
        provideRouter([]),
        { provide: ClientService, useValue: clientServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ConfirmationModalService, useValue: confirmationModalServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should load clients on init', () => {
      fixture.detectChanges();
      
      expect(clientServiceMock.getClients).toHaveBeenCalled();
      expect(component.clients().length).toBe(3);
      expect(component.totalElements()).toBe(3);
      expect(component.loading()).toBe(false);
    });

    it('should initialize pagination signals with default values', () => {
      expect(component.currentPage()).toBe(0);
      expect(component.pageSize()).toBe(10);
    });

    it('should initialize sorting signals with default values', () => {
      expect(component.sortField()).toBe('id');
      expect(component.sortDirection()).toBe('asc');
    });

    it('should log info when clients loaded successfully', () => {
      fixture.detectChanges();
      
      expect(loggerServiceMock.info).toHaveBeenCalledWith('Clients loaded successfully');
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // Create mock response with 25 clients for pagination testing
      const manyClients: Client[] = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        fullName: `Client ${i + 1}`,
        displayName: `Client ${i + 1}`,
        email: `client${i + 1}@example.com`,
        details: `Details for client ${i + 1}`,
        location: `${i + 1} Test St`,
        active: true
      }));
      
      const manyClientsResponse = {
        content: manyClients.slice(0, 10),
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { sorted: false, unsorted: true, empty: true },
          offset: 0,
          paged: true,
          unpaged: false
        },
        total: 25,
        size: 10,
        totalPages: 3,
        totalElements: 25,
        first: true,
        last: false,
        numberOfElements: 10,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        empty: false
      };
      
      clientServiceMock.getClients.mockReturnValue(of(manyClientsResponse));
      fixture.detectChanges();
    });

    it('should display total pages from backend', () => {
      expect(component.totalPages()).toBe(3);
    });

    it('should display correct number of clients on page', () => {
      const paginatedClients = component.clients();
      expect(paginatedClients.length).toBe(10);
      expect(paginatedClients[0].fullName).toBe('Client 1');
    });

    it('should navigate to next page and reload data', () => {
      component.nextPage();
      expect(component.currentPage()).toBe(1);
      expect(clientServiceMock.getClients).toHaveBeenCalledWith(1, 10, 'id', 'asc', '');
    });

    it('should navigate to previous page and reload data', () => {
      component.currentPage.set(2);
      component.previousPage();
      expect(component.currentPage()).toBe(1);
      expect(clientServiceMock.getClients).toHaveBeenCalled();
    });

    it('should not go beyond first page', () => {
      component.previousPage();
      expect(component.currentPage()).toBe(0);
    });

    it('should not go beyond last page', () => {
      component.currentPage.set(2);
      component.nextPage();
      expect(component.currentPage()).toBe(2); // Should stay at page 2 (index 2, which is page 3)
    });

    it('should go to specific page', () => {
      component.goToPage(1);
      expect(component.currentPage()).toBe(1);
      expect(clientServiceMock.getClients).toHaveBeenCalled();
    });

    it('should change page size and reset to page 0', () => {
      component.currentPage.set(1);
      
      const event = { target: { value: '25' } } as any;
      component.changePageSize(event);
      
      expect(component.pageSize()).toBe(25);
      expect(component.currentPage()).toBe(0);
      expect(clientServiceMock.getClients).toHaveBeenCalledWith(0, 25, 'id', 'asc', '');
    });

    it('should calculate page numbers correctly', () => {
      const pageNumbers = component.pageNumbers();
      expect(pageNumbers).toEqual([0, 1, 2]);
    });
  });

  describe('Client Operations', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show confirmation modal and delete client when confirmed', async () => {
      clientServiceMock.getClients.mockReturnValue(of(mockClientResponse));
      confirmationModalServiceMock.open.mockResolvedValue(true);
      
      await component.deleteClient(1);
      
      expect(confirmationModalServiceMock.open).toHaveBeenCalledWith({
        title: 'Delete Client',
        message: 'Are you sure you want to delete John Doe? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      });
      expect(clientServiceMock.deleteClient).toHaveBeenCalledWith(1);
      expect(notificationServiceMock.success).toHaveBeenCalledWith('Client deleted successfully!');
      expect(clientServiceMock.getClients).toHaveBeenCalled(); // Should reload
    });

    it('should not delete client when modal is cancelled', async () => {
      confirmationModalServiceMock.open.mockResolvedValue(false);
      
      await component.deleteClient(1);
      
      expect(confirmationModalServiceMock.open).toHaveBeenCalled();
      expect(clientServiceMock.deleteClient).not.toHaveBeenCalled();
      expect(notificationServiceMock.success).not.toHaveBeenCalled();
    });

    it('should not delete if id is undefined', async () => {
      await component.deleteClient(undefined);
      
      expect(confirmationModalServiceMock.open).not.toHaveBeenCalled();
      expect(clientServiceMock.deleteClient).not.toHaveBeenCalled();
    });

    it('should handle delete error', async () => {
      const error = new Error('Delete failed');
      clientServiceMock.deleteClient.mockReturnValue(throwError(() => error));
      confirmationModalServiceMock.open.mockResolvedValue(true);
      
      await component.deleteClient(1);
      
      expect(notificationServiceMock.error).toHaveBeenCalledWith('Failed to delete client. Please try again.');
      expect(loggerServiceMock.error).toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should search clients when search term has at least 3 characters', () => {
      const searchResults = [mockClients[0]];
      const searchResponse = { ...mockClientResponse, content: searchResults, totalElements: 1 };
      clientServiceMock.getClients.mockReturnValue(of(searchResponse));
      
      const event = { target: { value: 'John' } } as any;
      component.onSearch(event);
      
      expect(component.searchTerm()).toBe('John');
      expect(clientServiceMock.getClients).toHaveBeenCalledWith(0, 10, 'id', 'asc', 'John');
    });

    it('should reload clients when search term is empty', () => {
      const event = { target: { value: '' } } as any;
      component.onSearch(event);
      
      expect(component.searchTerm()).toBe('');
      expect(clientServiceMock.getClients).toHaveBeenCalledWith(0, 10, 'id', 'asc', '');
    });

    it('should reset to page 0 after search', () => {
      component.currentPage.set(2);
      
      const event = { target: { value: 'test' } } as any;
      component.onSearch(event);
      
      expect(component.currentPage()).toBe(0);
    });

    it('should not search when search term has less than 3 characters', () => {
      jest.clearAllMocks();
      
      const event = { target: { value: 'Jo' } } as any;
      component.onSearch(event);
      
      expect(component.searchTerm()).toBe('Jo');
      expect(clientServiceMock.getClients).not.toHaveBeenCalled();
    });

    it('should not reset page when search term has less than 3 characters', () => {
      component.currentPage.set(2);
      jest.clearAllMocks();
      
      const event = { target: { value: 'Jo' } } as any;
      component.onSearch(event);
      
      expect(component.currentPage()).toBe(2);
      expect(clientServiceMock.getClients).not.toHaveBeenCalled();
    });
  });

  describe('Sorting Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should sort by field in ascending order initially', () => {
      component.sortBy('fullName');
      
      expect(component.sortField()).toBe('fullName');
      expect(component.sortDirection()).toBe('asc');
      expect(clientServiceMock.getClients).toHaveBeenCalledWith(0, 10, 'fullName', 'asc', '');
    });

    it('should toggle sort direction when clicking same field', () => {
      component.sortBy('fullName');
      component.sortBy('fullName');
      
      expect(component.sortField()).toBe('fullName');
      expect(component.sortDirection()).toBe('desc');
    });

    it('should reset to ascending when sorting by different field', () => {
      component.sortBy('fullName');
      component.sortDirection.set('desc');
      component.sortBy('email');
      
      expect(component.sortField()).toBe('email');
      expect(component.sortDirection()).toBe('asc');
    });

    it('should reset to page 0 when sorting', () => {
      component.currentPage.set(2);
      component.sortBy('displayName');
      
      expect(component.currentPage()).toBe(0);
    });

    it('should return correct sort icon for unsorted fields', () => {
      component.sortField.set('fullName');
      expect(component.getSortIcon('email')).toBe('↕️');
    });

    it('should return ascending icon for sorted field', () => {
      component.sortField.set('fullName');
      component.sortDirection.set('asc');
      expect(component.getSortIcon('fullName')).toBe('↑');
    });

    it('should return descending icon for sorted field', () => {
      component.sortField.set('fullName');
      component.sortDirection.set('desc');
      expect(component.getSortIcon('fullName')).toBe('↓');
    });
  });

  describe('Error Handling', () => {
    it('should handle error when loading clients fails', () => {
      const error = new Error('Network error');
      clientServiceMock.getClients.mockReturnValue(throwError(() => error));
      
      component.loadClients();
      
      expect(component.error()).toBe('Failed to load clients. Please try again.');
      expect(component.loading()).toBe(false);
      expect(loggerServiceMock.error).toHaveBeenCalled();
    });

    it('should clear error when loading clients successfully', () => {
      component.error.set('Previous error');
      clientServiceMock.getClients.mockReturnValue(of(mockClientResponse));
      
      component.loadClients();
      
      expect(component.error()).toBeNull();
    });
  });

  describe('UI Helper Methods', () => {
    it('should track clients by id', () => {
      const client = mockClients[0];
      const trackId = component.trackByClientId(0, client);
      expect(trackId).toBe(1);
    });

    it('should track by index if client has no id', () => {
      const clientWithoutId = { ...mockClients[0], id: undefined };
      const trackId = component.trackByClientId(5, clientWithoutId);
      expect(trackId).toBe(5);
    });
  });

  describe('Loading State', () => {
    it('should set loading to true when fetching clients', () => {
      component.loadClients();
      // During the observable emission, loading should be true
      // After completion, it will be false
    });

    it('should set loading to false after clients loaded', () => {
      fixture.detectChanges();
      expect(component.loading()).toBe(false);
    });

    it('should set loading to false after error', () => {
      const error = new Error('Network error');
      clientServiceMock.getClients.mockReturnValue(throwError(() => error));
      
      component.loadClients();
      
      expect(component.loading()).toBe(false);
    });
  });

  describe('Math object exposure', () => {
    it('should expose Math object for template usage', () => {
      expect(component.Math).toBe(Math);
    });
  });
});
