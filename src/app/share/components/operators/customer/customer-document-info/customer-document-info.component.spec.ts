import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDocumentInfoComponent } from './customer-document-info.component';

describe('CustomerDocumentInfoComponent', () => {
  let component: CustomerDocumentInfoComponent;
  let fixture: ComponentFixture<CustomerDocumentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDocumentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDocumentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
