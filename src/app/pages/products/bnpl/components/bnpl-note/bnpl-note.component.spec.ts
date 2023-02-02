import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplNoteComponent } from './bnpl-note.component';

describe('BnplNoteComponent', () => {
  let component: BnplNoteComponent;
  let fixture: ComponentFixture<BnplNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnplNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
