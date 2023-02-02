import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCompanyInfoComponent } from './customer-company-info.component';

describe('CustomerCompanyInfoComponent', () => {
  let component: CustomerCompanyInfoComponent;
  let fixture: ComponentFixture<CustomerCompanyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCompanyInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
