import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdQuestionsListComponent } from './pd-questions-list.component';

describe('PdQuestionsListComponent', () => {
  let component: PdQuestionsListComponent;
  let fixture: ComponentFixture<PdQuestionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdQuestionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdQuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
