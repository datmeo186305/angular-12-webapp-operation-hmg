import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanContractComponent } from './loan-contract.component';

describe('LoanContractComponent', () => {
  let component: LoanContractComponent;
  let fixture: ComponentFixture<LoanContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
