import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareInfoVerificationComponent } from './compare-info-verification.component';

describe('CompareInfoVerificationComponent', () => {
  let component: CompareInfoVerificationComponent;
  let fixture: ComponentFixture<CompareInfoVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareInfoVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareInfoVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
