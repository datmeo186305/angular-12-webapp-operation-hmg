import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdAnswersListComponent } from './pd-answers-list.component';

describe('PdAnswersListComponent', () => {
  let component: PdAnswersListComponent;
  let fixture: ComponentFixture<PdAnswersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdAnswersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdAnswersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
