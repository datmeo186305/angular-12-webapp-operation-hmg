import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailUpdateDialogComponent } from './customer-detail-update-dialog.component';

describe('CustomerDetailUpdateDialogComponent', () => {
  let component: CustomerDetailUpdateDialogComponent;
  let fixture: ComponentFixture<CustomerDetailUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDetailUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
