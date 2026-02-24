import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ClientService } from './client.service';
import { Client, ClientResponse } from '../models/client.model';
import { environment } from '../../environments/environment';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}${environment.apiEndpoints.clients}`;

  const mockClients: Client[] = [
    {
      id: 1,
      fullName: 'John Doe',
      displayName: 'John D.',
      email: 'john.doe@example.com',
      details: 'Senior developer',
      location: '123 Main St, New York',
      active: true
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      displayName: 'Jane S.',
      email: 'jane.smith@example.com',
      details: 'Marketing specialist',
      location: '456 Oak Ave, Boston',
      active: true
    }
  ];

  const mockClientResponse: ClientResponse = {
    content: mockClients,
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: { sorted: false, unsorted: true, empty: true },
      offset: 0,
      paged: true,
      unpaged: false
    },
    total: 2,
    size: 10,
    totalPages: 1,
    totalElements: 2,
    first: true,
    last: true,
    numberOfElements: 2,
    number: 0,
    sort: { sorted: false, unsorted: true, empty: true },
    empty: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch clients with all query params and update clients$', (done) => {
    service.getClients(2, 25, 'fullName', 'desc', 'John').subscribe({
      next: (response) => {
        expect(response.content.length).toBe(2);
        expect(response.totalElements).toBe(2);
        done();
      }
    });

    const req = httpMock.expectOne(req => 
      req.url === apiUrl && 
      req.params.get('page') === '2' &&
      req.params.get('size') === '25' &&
      req.params.get('orderBy') === 'fullName' &&
      req.params.get('direction') === 'desc' &&
      req.params.get('search') === 'John'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockClientResponse);
  });

  it('should handle getClients error', (done) => {
    service.getClients().subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        done();
      }
    });

    const req = httpMock.expectOne(req => req.url === apiUrl);
    req.flush('Server error', { status: 500, statusText: 'Error' });
  });

  describe('getClientById', () => {
    it('should fetch client by id', (done) => {
      const mockClient = mockClients[0];
      service.getClientById(1).subscribe({
        next: (client) => {
          expect(client).toEqual(mockClient);
          expect(client.id).toBe(1);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockClient);
    });

    it('should handle getClientById error', (done) => {
      service.getClientById(999).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createClient', () => {
    it('should create client', (done) => {
      const newClient: Client = {
        fullName: 'Bob Johnson',
        displayName: 'Bob J.',
        email: 'bob@example.com',
        details: 'Software engineer',
        location: '789 Pine St',
        active: true
      };

      const createdClient = { ...newClient, id: 3 };

      service.createClient(newClient).subscribe({
        next: (client) => {
          expect(client.id).toBe(3);
          expect(client.fullName).toBe('Bob Johnson');
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newClient);
      req.flush(createdClient);
    });

    it('should handle createClient error', (done) => {
      const newClient: Client = {
        fullName: 'Invalid',
        displayName: 'Inv',
        email: 'invalid-email',
        details: 'Test',
        location: 'Test',
        active: true
      };

      service.createClient(newClient).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateClient', () => {
    it('should update client', (done) => {
      const updatedClient: Client = {
        id: 1,
        fullName: 'John Doe Updated',
        displayName: 'John D.',
        email: 'john.updated@example.com',
        details: 'Senior developer',
        location: '123 Main St, New York',
        active: false
      };

      service.updateClient(1, updatedClient).subscribe({
        next: (client) => {
          expect(client.email).toBe('john.updated@example.com');
          expect(client.active).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedClient);
      req.flush(updatedClient);
    });

    it('should handle updateClient error', (done) => {
      const updatedClient: Client = {
        fullName: 'Test',
        displayName: 'Test',
        email: 'test@example.com',
        details: 'Test',
        location: 'Test',
        active: true
      };

      service.updateClient(999, updatedClient).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteClient', () => {
    it('should delete client', (done) => {
      service.deleteClient(1).subscribe({
        next: () => {
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle deleteClient error', (done) => {
      service.deleteClient(999).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
