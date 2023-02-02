import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanNoteComponent } from './loan-note.component';

describe('LoanNoteComponent', () => {
  let component: LoanNoteComponent;
  let fixture: ComponentFixture<LoanNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
