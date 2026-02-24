import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  private modalService = inject(ConfirmationModalService);

  isOpen = this.modalService.isOpen;
  title = this.modalService.title;
  message = this.modalService.message;
  confirmText = this.modalService.confirmText;
  cancelText = this.modalService.cancelText;

  onConfirm(): void {
    this.modalService.confirm();
  }

  onCancel(): void {
    this.modalService.cancel();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
