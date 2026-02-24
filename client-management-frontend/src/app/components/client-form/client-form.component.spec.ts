import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ClientFormComponent } from './client-form.component';
import { ClientService } from '../../services/client.service';
import { LoggerService } from '../../core/services/logger.service';
import { NotificationService } from '../../core/services/notification.service';
import { Client } from '../../models/client.model';

describe('ClientFormComponent', () => {
  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;
  let clientServiceMock: jest.Mocked<ClientService>;
  let loggerServiceMock: jest.Mocked<LoggerService>;
  let notificationServiceMock: jest.Mocked<NotificationService>;
  let router: Router;
  let activatedRouteMock: any;

  const mockClient: Client = {
    id: 1,
    fullName: 'John Doe',
    displayName: 'John D.',
    email: 'john@example.com',
    details: 'Senior developer with expertise in Angular',
    location: '123 Main St',
    active: true
  };

  beforeEach(async () => {
    clientServiceMock = {
      getClientById: jest.fn().mockReturnValue(of(mockClient)),
      createClient: jest.fn().mockReturnValue(of(mockClient)),
      updateClient: jest.fn().mockReturnValue(of(mockClient)),
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

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null)
        }
      },
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [ClientFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: ClientService, useValue: clientServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values in create mode', () => {
      fixture.detectChanges();
      
      expect(component.clientForm).toBeDefined();
      expect(component.clientForm.get('fullName')?.value).toBe('');
      expect(component.clientForm.get('displayName')?.value).toBe('');
      expect(component.clientForm.get('email')?.value).toBe('');
      expect(component.clientForm.get('active')?.value).toBe(true);
      expect(component.isEditMode()).toBe(false);
    });

    it('should have all required form controls', () => {
      fixture.detectChanges();
      
      expect(component.clientForm.get('fullName')).toBeDefined();
      expect(component.clientForm.get('displayName')).toBeDefined();
      expect(component.clientForm.get('email')).toBeDefined();
      expect(component.clientForm.get('details')).toBeDefined();
      expect(component.clientForm.get('location')).toBeDefined();
      expect(component.clientForm.get('active')).toBeDefined();
    });

    it('should set up validators correctly', () => {
      fixture.detectChanges();
      
      const fullName = component.clientForm.get('fullName');
      const email = component.clientForm.get('email');
      
      expect(fullName?.hasError('required')).toBe(true);
      
      fullName?.setValue('A');
      expect(fullName?.hasError('minlength')).toBe(true);
      
      email?.setValue('invalid-email');
      expect(email?.hasError('email')).toBe(true);
    });

  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');
    });

    it('should detect edit mode and load client', () => {
      fixture.detectChanges();
      
      expect(component.isEditMode()).toBe(true);
      expect(component.clientId()).toBe(1);
      expect(clientServiceMock.getClientById).toHaveBeenCalledWith(1);
    });

    it('should populate form with client data in edit mode', () => {
      fixture.detectChanges();
      
      expect(component.clientForm.get('fullName')?.value).toBe('John Doe');
      expect(component.clientForm.get('displayName')?.value).toBe('John D.');
      expect(component.clientForm.get('email')?.value).toBe('john@example.com');
      expect(component.clientForm.get('details')?.value).toBe('Senior developer with expertise in Angular');
      expect(component.clientForm.get('location')?.value).toBe('123 Main St');
    });

    it('should not enter edit mode for "new" route', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('new');
      fixture.detectChanges();
      
      expect(component.isEditMode()).toBe(false);
      expect(clientServiceMock.getClientById).not.toHaveBeenCalled();
    });

    it('should handle error when loading client fails', () => {
      const error = new Error('Client not found');
      clientServiceMock.getClientById.mockReturnValue(throwError(() => error));
      
      fixture.detectChanges();
      
      expect(component.error()).toBe('Failed to load client data.');
      expect(component.loading()).toBe(false);
      expect(loggerServiceMock.error).toHaveBeenCalled();
    });
  });

  describe('Form Submission - Create Mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create client when form is valid', async () => {
      component.clientForm.patchValue({
        fullName: 'Jane Smith',
        displayName: 'Jane S.',
        email: 'jane@example.com',
        details: 'Marketing specialist with over 10 years of experience in digital marketing, social media strategy, and brand development.',
        location: '456 Oak Ave',
        active: true
      });

      component.onSubmit();

      expect(clientServiceMock.createClient).toHaveBeenCalled();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(router.navigate).toHaveBeenCalledWith(['/clients'], { queryParams: {} });
    });

    it('should not submit when form is invalid', () => {
      component.clientForm.patchValue({
        fullName: '',
        displayName: '',
        email: 'invalid-email'
      });

      component.onSubmit();

      expect(clientServiceMock.createClient).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      component.onSubmit();

      Object.keys(component.clientForm.controls).forEach(key => {
        expect(component.clientForm.get(key)?.touched).toBe(true);
      });
    });

    it('should handle create error', () => {
      const error = new Error('Create failed');
      clientServiceMock.createClient.mockReturnValue(throwError(() => error));

      component.clientForm.patchValue({
        fullName: 'Jane Smith',
        displayName: 'Jane S.',
        email: 'jane@example.com',
        details: 'Marketing specialist with over 10 years of experience in digital marketing, social media strategy, and brand development.',
        location: '456 Oak Ave',
        active: true
      });

      component.onSubmit();

      expect(component.error()).toBe('Failed to create client. Please try again.');
      expect(component.loading()).toBe(false);
      expect(loggerServiceMock.error).toHaveBeenCalled();
    });

    it('should set loading state during creation', () => {
      component.clientForm.patchValue({
        fullName: 'Jane Smith',
        displayName: 'Jane S.',
        email: 'jane@example.com',
        details: 'Marketing specialist',
        location: '456 Oak Ave',
        active: true
      });

      component.onSubmit();
      // Loading will be set during the observable
    });
  });

  describe('Form Submission - Edit Mode', () => {
    beforeEach(() => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');
      fixture.detectChanges();
    });

    it('should update client when form is valid in edit mode', async () => {
      component.clientForm.patchValue({
        fullName: 'John Doe Updated',
        displayName: 'John D.',
        email: 'john.updated@example.com',
        details: 'Senior software developer with extensive experience in full-stack development, cloud architecture, and team leadership.',
        location: '789 New St',
        active: false
      });

      component.onSubmit();

      expect(clientServiceMock.updateClient).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          fullName: 'John Doe Updated',
          displayName: 'John D.',
          email: 'john.updated@example.com'
        })
      );
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(router.navigate).toHaveBeenCalledWith(['/clients'], { queryParams: {} });
    });

    it('should handle update error', () => {
      const error = new Error('Update failed');
      clientServiceMock.updateClient.mockReturnValue(throwError(() => error));

      component.clientForm.patchValue({
        fullName: 'Updated Name',
        displayName: 'Updated N.',
        email: 'updated@example.com',
        details: 'Professional with comprehensive background in project management, strategic planning, and cross-functional team coordination.',
        location: '123 St',
        active: true
      });

      component.onSubmit();

      expect(component.error()).toBe('Failed to update client. Please try again.');
      expect(component.loading()).toBe(false);
      expect(loggerServiceMock.error).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate fullName is required', () => {
      const fullName = component.clientForm.get('fullName');
      expect(fullName?.hasError('required')).toBe(true);
      
      fullName?.setValue('John Doe');
      expect(fullName?.hasError('required')).toBe(false);
    });

    it('should validate fullName minimum length', () => {
      const fullName = component.clientForm.get('fullName');
      fullName?.setValue('A');
      expect(fullName?.hasError('minlength')).toBe(true);
      
      fullName?.setValue('John Doe');
      expect(fullName?.hasError('minlength')).toBe(false);
    });

    it('should validate email format', () => {
      const email = component.clientForm.get('email');
      
      email?.setValue('invalid');
      expect(email?.hasError('email')).toBe(true);
      
      email?.setValue('valid@example.com');
      expect(email?.hasError('email')).toBe(false);
    });

    it('should validate location is required', () => {
      const location = component.clientForm.get('location');
      expect(location?.hasError('required')).toBe(true);
      
      location?.setValue('123 Main St');
      expect(location?.hasError('required')).toBe(false);
    });

    it('should validate form is valid with all required fields', () => {
      component.clientForm.patchValue({
        fullName: 'John Doe',
        displayName: 'John D.',
        email: 'john@example.com',
        details: 'Senior software developer with extensive experience building web applications using modern frameworks and technologies.',
        location: '123 Main St',
        active: true
      });

      expect(component.clientForm.valid).toBe(true);
    });
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should check if field is invalid and touched', () => {
      const fullName = component.clientForm.get('fullName');
      
      expect(component.isFieldInvalid('fullName')).toBe(false);
      
      fullName?.markAsTouched();
      expect(component.isFieldInvalid('fullName')).toBe(true);
      
      fullName?.setValue('John Doe');
      expect(component.isFieldInvalid('fullName')).toBe(false);
    });

    it('should get field error message', () => {
      const fullName = component.clientForm.get('fullName');
      fullName?.markAsTouched();
      
      let errorMsg = component.getFieldError('fullName');
      expect(errorMsg).toContain('required');
      
      fullName?.setValue('A');
      errorMsg = component.getFieldError('fullName');
      expect(errorMsg).toContain('Minimum length is 2');
    });

    it('should get email error message', () => {
      const email = component.clientForm.get('email');
      email?.setValue('invalid');
      email?.markAsTouched();
      
      const errorMsg = component.getFieldError('email');
      expect(errorMsg).toContain('valid email');
    });

    it('should return empty string for valid field', () => {
      const fullName = component.clientForm.get('fullName');
      fullName?.setValue('John Doe');
      fullName?.markAsTouched();
      
      const errorMsg = component.getFieldError('fullName');
      expect(errorMsg).toBe('');
    });
  });

  describe('Cancel Action', () => {
    it('should navigate to clients list when cancelled', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/clients'], { queryParams: {} });
    });
  });

  describe('Error State Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should clear error when submitting form', () => {
      component.error.set('Previous error');
      
      component.clientForm.patchValue({
        fullName: 'Jane Smith',
        displayName: 'Jane S.',
        email: 'jane@example.com',
        details: 'Marketing specialist with over 10 years of experience in digital marketing, social media strategy, and brand development.',
        location: '456 Oak Ave',
        active: true
      });

      component.onSubmit();

      expect(component.error()).toBeNull();
    });
  });
});
