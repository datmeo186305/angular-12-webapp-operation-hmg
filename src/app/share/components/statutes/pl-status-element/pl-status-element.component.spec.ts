import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlStatusElementComponent } from './pl-status-element.component';

describe('PlStatusElementComponent', () => {
  let component: PlStatusElementComponent;
  let fixture: ComponentFixture<PlStatusElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlStatusElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlStatusElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
