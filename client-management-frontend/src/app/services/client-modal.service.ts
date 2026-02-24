import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientModalService {
  isOpen = signal(false);
  clientId = signal<number | null>(null);
  
  private clientDeletedSubject = new Subject<number>();
  clientDeleted$ = this.clientDeletedSubject.asObservable();

  open(clientId: number): void {
    this.clientId.set(clientId);
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen.set(false);
    this.clientId.set(null);
    document.body.style.overflow = '';
  }

  notifyClientDeleted(clientId: number): void {
    this.clientDeletedSubject.next(clientId);
  }
}
