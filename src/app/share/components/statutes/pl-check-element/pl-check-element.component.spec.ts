import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlCheckElementComponent } from './pl-check-element.component';

describe('PlCheckElementComponent', () => {
  let component: PlCheckElementComponent;
  let fixture: ComponentFixture<PlCheckElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlCheckElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlCheckElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
