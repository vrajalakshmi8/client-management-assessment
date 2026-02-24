import { Component, OnInit, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { LoggerService } from '../../core/services/logger.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';
import { ClientModalService } from '../../services/client-modal.service';
import { ClientDetailModalComponent } from '../client-detail-modal/client-detail-modal.component';
import { Subscription, from, EMPTY } from 'rxjs';
import { filter, switchMap, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ClientDetailModalComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);
  private confirmationModalService = inject(ConfirmationModalService);
  modalService = inject(ClientModalService); // Public for template access
  private deletionSubscription?: Subscription;
  private queryParamsSubscription?: Subscription;

  // Data signals
  clients = signal<Client[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchTerm = signal('');

  // Pagination signals
  currentPage = signal(0); // Backend uses 0-based indexing
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);

  // Sorting signals
  sortField = signal<string>('id');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Computed values
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    // Show max 5 page numbers
    let startPage = Math.max(0, current - 2);
    let endPage = Math.min(total - 1, current + 2);
    
    // Adjust if we're near the start or end
    if (current <= 2) {
      endPage = Math.min(4, total - 1);
    }
    if (current >= total - 3) {
      startPage = Math.max(0, total - 5);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  });

  Math = Math; // Expose Math for template

  ngOnInit(): void {
    // Read query parameters from URL
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.currentPage.set(params['page'] ? +params['page'] : 0);
      this.pageSize.set(params['size'] ? +params['size'] : 10);
      this.sortField.set(params['sort'] || 'id');
      this.sortDirection.set(params['direction'] === 'desc' ? 'desc' : 'asc');
      this.searchTerm.set(params['search'] || '');
      
      this.loadClients();
    });
    
    // Subscribe to client deletion events from modal
    this.deletionSubscription = this.modalService.clientDeleted$.subscribe(
      (clientId) => {
        // Reload the current page after deletion
        this.loadClients();
      }
    );
  }

  ngOnDestroy(): void {
    this.deletionSubscription?.unsubscribe();
    this.queryParamsSubscription?.unsubscribe();
  }

  openClientModal(clientId: number | undefined): void {
    if (clientId) {
      this.modalService.open(clientId);
    }
  }

  loadClients(): void {
    this.loading.set(true);
    this.error.set(null);

    // Update URL with current pagination state
    this.updateUrl();

    this.clientService.getClients(
      this.currentPage(),
      this.pageSize(),
      this.sortField(),
      this.sortDirection(),
      this.searchTerm()
    ).subscribe({
      next: (response) => {
        this.clients.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
        this.logger.info('Clients loaded successfully');
      },
      error: (err) => {
        this.error.set('Failed to load clients. Please try again.');
        this.loading.set(false);
        this.logger.error('Error loading clients', err);
      }
    });
  }

  private updateUrl(): void {
    const queryParams: any = {
      page: this.currentPage(),
      size: this.pageSize(),
      sort: this.sortField(),
      direction: this.sortDirection()
    };

    if (this.searchTerm()) {
      queryParams.search = this.searchTerm();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  deleteClient(id: number | undefined): void {
    if (!id) return;

    const client = this.clients().find(c => c.id === id);
    const clientName = client?.fullName || 'this client';

    from(this.confirmationModalService.open({
      title: 'Delete Client',
      message: `Are you sure you want to delete ${clientName}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })).pipe(
      filter(confirmed => confirmed), // Only proceed if confirmed
      switchMap(() => this.clientService.deleteClient(id)),
      tap(() => {
        this.notificationService.success('Client deleted successfully!');
        this.loadClients();
        this.logger.info(`Client ${id} deleted successfully`);
      }),
      catchError(err => {
        this.notificationService.error('Failed to delete client. Please try again.');
        this.logger.error('Error deleting client', err);
        return EMPTY;
      })
    ).subscribe();
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    
    // Only search if term is empty (clear search) or has at least 3 characters
    if (term.length === 0 || term.length >= 3) {
      this.currentPage.set(0); // Reset to first page on search
      this.loadClients();
    }
  }

  // Sorting methods
  sortBy(field: string): void {
    if (this.sortField() === field) {
      // Toggle direction if same field
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(0); // Reset to first page
    this.loadClients();
  }

  getSortIcon(field: string): string {
    if (this.sortField() !== field) {
      return '↕️'; // Unsorted
    }
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadClients();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  changePageSize(event: Event): void {
    const size = parseInt((event.target as HTMLSelectElement).value);
    this.pageSize.set(size);
    this.currentPage.set(0); // Reset to first page
    this.loadClients();
  }

  trackByClientId(index: number, client: Client): number {
    return client.id || index;
  }

  getCurrentQueryParams(): any {
    const params: any = {
      page: this.currentPage(),
      size: this.pageSize(),
      sort: this.sortField(),
      direction: this.sortDirection()
    };

    if (this.searchTerm()) {
      params.search = this.searchTerm();
    }

    return params;
  }

  // Helper methods for template DRY principle
  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getEditLink(clientId: number | undefined): any[] {
    return ['/clients', clientId, 'edit'];
  }

  shouldShowFirstPage(): boolean {
    return this.pageNumbers()[0] > 0;
  }

  shouldShowFirstEllipsis(): boolean {
    return this.pageNumbers()[0] > 1;
  }

  shouldShowLastPage(): boolean {
    return this.pageNumbers()[this.pageNumbers().length - 1] < this.totalPages() - 1;
  }

  shouldShowLastEllipsis(): boolean {
    return this.pageNumbers()[this.pageNumbers().length - 1] < this.totalPages() - 2;
  }

  getShowingRange(): string {
    const start = this.currentPage() * this.pageSize() + 1;
    const end = Math.min((this.currentPage() + 1) * this.pageSize(), this.totalElements());
    return `${start} - ${end}`;
  }
}
