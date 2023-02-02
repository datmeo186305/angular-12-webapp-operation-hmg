import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplPaymentDialogComponent } from './bnpl-payment-dialog.component';

describe('BnplPaymentDialogComponent', () => {
  let component: BnplPaymentDialogComponent;
  let fixture: ComponentFixture<BnplPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnplPaymentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
