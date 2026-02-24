import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let service: ConfirmationModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ConfirmationModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible initially', () => {
    const compiled = fixture.nativeElement;
    const modal = compiled.querySelector('[role="dialog"]');
    expect(modal).toBeNull();
  });

  it('should display modal when opened', async () => {
    service.open({
      title: 'Test Title',
      message: 'Test Message'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const modal = compiled.querySelector('[role="dialog"]');
    expect(modal).toBeTruthy();
  });

  it('should display correct title and message', async () => {
    service.open({
      title: 'Delete Confirmation',
      message: 'Are you sure you want to delete this item?'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('#modal-title');
    const message = compiled.querySelector('p');

    expect(title?.textContent?.trim()).toBe('Delete Confirmation');
    expect(message?.textContent?.trim()).toBe('Are you sure you want to delete this item?');
  });

  it('should display custom button text', async () => {
    service.open({
      title: 'Test',
      message: 'Message',
      confirmText: 'Yes, Delete',
      cancelText: 'No, Keep'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button');
    
    expect(buttons[0]?.textContent?.trim()).toBe('No, Keep');
    expect(buttons[1]?.textContent?.trim()).toBe('Yes, Delete');
  });

  it('should call confirm when confirm button is clicked', async () => {
    jest.spyOn(service, 'confirm');

    service.open({
      title: 'Test',
      message: 'Message'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button');
    const confirmButton = buttons[1]; // Second button is confirm
    
    confirmButton?.click();
    
    expect(service.confirm).toHaveBeenCalled();
  });

  it('should call cancel when cancel button is clicked', async () => {
    jest.spyOn(service, 'cancel');

    service.open({
      title: 'Test',
      message: 'Message'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('button');
    const cancelButton = buttons[0]; // First button is cancel
    
    cancelButton?.click();
    
    expect(service.cancel).toHaveBeenCalled();
  });

  it('should call cancel when backdrop is clicked', async () => {
    jest.spyOn(service, 'cancel');

    service.open({
      title: 'Test',
      message: 'Message'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const backdrop = compiled.querySelector('[role="dialog"]');
    
    backdrop?.click();
    
    expect(service.cancel).toHaveBeenCalled();
  });

  it('should not close when modal content is clicked', async () => {
    jest.spyOn(service, 'cancel');

    service.open({
      title: 'Test',
      message: 'Message'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const modalContent = compiled.querySelector('.bg-white');
    
    modalContent?.click();
    
    expect(service.cancel).not.toHaveBeenCalled();
  });
});
