import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDetailInfoComponent } from './loan-detail-info.component';

describe('LoanDetailInfoComponent', () => {
  let component: LoanDetailInfoComponent;
  let fixture: ComponentFixture<LoanDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanDetailInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
