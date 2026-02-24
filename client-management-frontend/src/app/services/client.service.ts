import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Client, ClientResponse, ApiResponse } from '../models/client.model';
import { environment } from '../../environments/environment';
import { LoggerService } from '../core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
  
  private readonly apiUrl = `${environment.apiUrl}${environment.apiEndpoints.clients}`;
  
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  public clients$ = this.clientsSubject.asObservable();


  getClients(
    page: number = 0,
    size: number = 10,
    orderBy?: string,
    direction: 'asc' | 'desc' = 'asc',
    search?: string
  ): Observable<ClientResponse> {
    this.logger.info('Fetching clients with params:', { page, size, orderBy, direction, search });
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('direction', direction);

    if (orderBy) {
      params = params.set('orderBy', orderBy);
    }

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ClientResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        console.log('Clients fetched from API:', response);
        this.clientsSubject.next(response.content);
        this.logger.info(`Retrieved ${response.content.length} clients (page ${page + 1})`);
      }),
      catchError(error => {
        this.logger.error('Error fetching clients', error);
        return throwError(() => error);
      })
    );
  }


  getClientById(id: number): Observable<Client> {
    this.logger.info(`Fetching client with ID: ${id}`);
    return this.http.get<Client>(`${this.apiUrl}/${id}`).pipe(
      tap(client => this.logger.info('Client retrieved', client)),
      catchError(error => {
        this.logger.error(`Error fetching client ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  createClient(client: Client): Observable<Client> {
    this.logger.info('Creating new client', client);
    return this.http.post<Client>(this.apiUrl, client).pipe(
      tap(newClient => {
        const currentClients = this.clientsSubject.value;
        this.clientsSubject.next([...currentClients, newClient]);
        this.logger.info('Client created successfully', newClient);
      }),
      catchError(error => {
        this.logger.error('Error creating client', error);
        return throwError(() => error);
      })
    );
  }

  updateClient(id: number, client: Client): Observable<Client> {
    this.logger.info(`Updating client ${id}`, client);
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client).pipe(
      tap(updatedClient => {
        const currentClients = this.clientsSubject.value;
        const index = currentClients.findIndex(c => c.id === id);
        if (index !== -1) {
          currentClients[index] = updatedClient;
          this.clientsSubject.next([...currentClients]);
        }
        this.logger.info('Client updated successfully', updatedClient);
      }),
      catchError(error => {
        this.logger.error(`Error updating client ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  deleteClient(id: number): Observable<void> {
    this.logger.info(`Deleting client ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentClients = this.clientsSubject.value;
        this.clientsSubject.next(currentClients.filter(c => c.id !== id));
        this.logger.info(`Client ${id} deleted successfully`);
      }),
      catchError(error => {
        this.logger.error(`Error deleting client ${id}`, error);
        return throwError(() => error);
      })
    );
  }
}
