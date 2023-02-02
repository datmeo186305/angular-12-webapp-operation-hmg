import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailElementComponent } from './customer-detail-element.component';

describe('CustomerDetailElementComponent', () => {
  let component: CustomerDetailElementComponent;
  let fixture: ComponentFixture<CustomerDetailElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDetailElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
