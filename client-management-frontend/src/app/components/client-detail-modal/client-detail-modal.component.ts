import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientModalService } from '../../services/client-modal.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { LoggerService } from '../../core/services/logger.service';

@Component({
  selector: 'app-client-detail-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-detail-modal.component.html',
  styleUrl: './client-detail-modal.component.scss'
})
export class ClientDetailModalComponent {
  private modalService = inject(ClientModalService);
  private clientService = inject(ClientService);
  private logger = inject(LoggerService);

  isOpen = this.modalService.isOpen;
  clientId = this.modalService.clientId;
  
  client = signal<Client | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    // Watch for clientId changes and load client data
    effect(() => {
      const id = this.clientId();
      if (id && this.isOpen()) {
        this.loadClient(id);
      }
    });
  }

  loadClient(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.client.set(client);
        this.loading.set(false);
        this.logger.info('Client details loaded in modal', client);
      },
      error: (err) => {
        this.error.set('Failed to load client details. Please try again.');
        this.loading.set(false);
        this.logger.error('Error loading client details in modal', err);
      }
    });
  }

  closeModal(): void {
    this.modalService.close();
    this.client.set(null);
    this.error.set(null);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
