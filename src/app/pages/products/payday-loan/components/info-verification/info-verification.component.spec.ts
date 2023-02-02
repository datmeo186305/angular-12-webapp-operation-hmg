import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoVerificationComponent } from './info-verification.component';

describe('InfoVerificationComponent', () => {
  let component: InfoVerificationComponent;
  let fixture: ComponentFixture<InfoVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
