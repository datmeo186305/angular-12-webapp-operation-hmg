import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplRepaymentTransactionComponent } from './bnpl-repayment-transaction.component';

describe('BnplRepaymentTransactionComponent', () => {
  let component: BnplRepaymentTransactionComponent;
  let fixture: ComponentFixture<BnplRepaymentTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnplRepaymentTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplRepaymentTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
