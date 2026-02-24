import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { LoggerService } from '../../core/services/logger.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);

  clientForm!: FormGroup;
  isEditMode = signal(false);
  clientId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  returnQueryParams: any = {};

  ngOnInit(): void {
    // Store query params to preserve pagination state
    this.route.queryParams.subscribe(params => {
      this.returnQueryParams = { ...params };
    });
    
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.clientForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      details: ['', [Validators.required]],
      location: ['', Validators.required],
      active: [true, Validators.required]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.clientId.set(+id);
      this.loadClient(+id);
    }
  }

  private loadClient(id: number): void {
    this.loading.set(true);
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.clientForm.patchValue(client);
        this.loading.set(false);
        this.logger.info('Client loaded for editing', client);
      },
      error: (err) => {
        this.error.set('Failed to load client data.');
        this.loading.set(false);
        this.logger.error('Error loading client', err);
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched(this.clientForm);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const clientData: Client = this.clientForm.value;

    if (this.isEditMode() && this.clientId()) {
      this.updateClient(this.clientId()!, clientData);
    } else {
      this.createClient(clientData);
    }
  }

  private createClient(client: Client): void {
    this.clientService.createClient(client).subscribe({
      next: (newClient) => {
        this.logger.info('Client created successfully', newClient);
        this.notificationService.success('Client created successfully!');
        this.navigateToList();
      },
      error: (err) => {
        this.error.set('Failed to create client. Please try again.');
        this.loading.set(false);
        this.logger.error('Error creating client', err);
      }
    });
  }

  private updateClient(id: number, client: Client): void {
    this.clientService.updateClient(id, client).subscribe({
      next: (updatedClient) => {
        this.logger.info('Client updated successfully', updatedClient);
        this.notificationService.success('Client updated successfully!');
        this.navigateToList();
      },
      error: (err) => {
        this.error.set('Failed to update client. Please try again.');
        this.loading.set(false);
        this.logger.error('Error updating client', err);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return 'This field is required';
    }
    if (field.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength}`;
    }

    return 'Invalid input';
  }

  onCancel(): void {
    this.navigateToList();
  }

  navigateToList(): void {
    this.router.navigate(['/clients'], {
      queryParams: this.returnQueryParams
    });
  }
}
