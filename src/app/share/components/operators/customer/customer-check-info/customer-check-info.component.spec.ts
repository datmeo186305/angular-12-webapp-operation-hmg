import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCheckInfoComponent } from './customer-check-info.component';

describe('CustomerCheckInfoComponent', () => {
  let component: CustomerCheckInfoComponent;
  let fixture: ComponentFixture<CustomerCheckInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCheckInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCheckInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
