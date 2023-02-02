import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRatingComponent } from './loan-rating.component';

describe('LoanRatingComponent', () => {
  let component: LoanRatingComponent;
  let fixture: ComponentFixture<LoanRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
