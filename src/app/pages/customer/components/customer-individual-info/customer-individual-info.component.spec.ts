import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIndividualInfoComponent } from './customer-individual-info.component';

describe('CustomerIndividualInfoComponent', () => {
  let component: CustomerIndividualInfoComponent;
  let fixture: ComponentFixture<CustomerIndividualInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerIndividualInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerIndividualInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
