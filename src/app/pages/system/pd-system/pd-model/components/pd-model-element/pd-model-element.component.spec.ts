import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdModelElementComponent } from './pd-model-element.component';

describe('PdModelElementComponent', () => {
  let component: PdModelElementComponent;
  let fixture: ComponentFixture<PdModelElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdModelElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdModelElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
