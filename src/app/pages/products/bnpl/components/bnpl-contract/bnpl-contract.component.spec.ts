import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplContractComponent } from './bnpl-contract.component';

describe('BnplContractComponent', () => {
  let component: BnplContractComponent;
  let fixture: ComponentFixture<BnplContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnplContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
