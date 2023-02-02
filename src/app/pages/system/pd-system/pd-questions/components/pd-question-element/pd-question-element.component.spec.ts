import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdQuestionElementComponent } from './pd-question-element.component';

describe('PdQuestionElementComponent', () => {
  let component: PdQuestionElementComponent;
  let fixture: ComponentFixture<PdQuestionElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdQuestionElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdQuestionElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
