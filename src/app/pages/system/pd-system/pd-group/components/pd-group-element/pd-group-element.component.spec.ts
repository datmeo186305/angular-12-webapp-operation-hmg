import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdGroupElementComponent } from './pd-group-element.component';

describe('PdGroupElementComponent', () => {
  let component: PdGroupElementComponent;
  let fixture: ComponentFixture<PdGroupElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdGroupElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdGroupElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
