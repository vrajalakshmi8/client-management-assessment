import { Injectable, signal } from '@angular/core';

export interface ConfirmationModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {
  isOpen = signal(false);
  title = signal('');
  message = signal('');
  confirmText = signal('Confirm');
  cancelText = signal('Cancel');

  private resolveCallback?: (confirmed: boolean) => void;

  open(options: ConfirmationModalOptions): Promise<boolean> {
    this.title.set(options.title);
    this.message.set(options.message);
    this.confirmText.set(options.confirmText || 'Confirm');
    this.cancelText.set(options.cancelText || 'Cancel');
    this.isOpen.set(true);

    return new Promise<boolean>((resolve) => {
      this.resolveCallback = resolve;
    });
  }

  confirm(): void {
    this.isOpen.set(false);
    if (this.resolveCallback) {
      this.resolveCallback(true);
      this.resolveCallback = undefined;
    }
  }

  cancel(): void {
    this.isOpen.set(false);
    if (this.resolveCallback) {
      this.resolveCallback(false);
      this.resolveCallback = undefined;
    }
  }
}
