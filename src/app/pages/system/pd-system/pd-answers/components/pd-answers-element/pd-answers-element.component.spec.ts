import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdAnswersElementComponent } from './pd-answers-element.component';

describe('PdAnswersElementComponent', () => {
  let component: PdAnswersElementComponent;
  let fixture: ComponentFixture<PdAnswersElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdAnswersElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdAnswersElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
