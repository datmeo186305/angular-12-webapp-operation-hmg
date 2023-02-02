import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerActivityHistoryComponent } from './customer-activity-history.component';

describe('CustomerActivityHistoryComponent', () => {
  let component: CustomerActivityHistoryComponent;
  let fixture: ComponentFixture<CustomerActivityHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerActivityHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerActivityHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
