import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEkycInfoComponent } from './customer-ekyc-info.component';

describe('CustomerEkycInfoComponent', () => {
  let component: CustomerEkycInfoComponent;
  let fixture: ComponentFixture<CustomerEkycInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerEkycInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEkycInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
