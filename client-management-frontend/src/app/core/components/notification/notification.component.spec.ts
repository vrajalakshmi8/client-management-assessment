import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { NotificationService } from '../../services/notification.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [NotificationService]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display notifications', () => {
    notificationService.success('Test success message');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.notification')).toBeTruthy();
    expect(compiled.textContent).toContain('Test success message');
  });

  it('should display multiple notifications', () => {
    notificationService.success('Message 1');
    notificationService.error('Message 2');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const notifications = compiled.querySelectorAll('.notification');
    expect(notifications.length).toBe(2);
  });

  it('should remove notification on close button click', () => {
    notificationService.success('Test message');
    fixture.detectChanges();

    expect(notificationService.notifications().length).toBe(1);

    const closeButton = fixture.nativeElement.querySelector('button[aria-label="Close notification"]') as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();

    expect(notificationService.notifications().length).toBe(0);
  });
});
