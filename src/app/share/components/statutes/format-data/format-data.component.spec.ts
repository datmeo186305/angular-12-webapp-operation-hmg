import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatDataComponent } from './format-data.component';

describe('FormatDataComponent', () => {
  let component: FormatDataComponent;
  let fixture: ComponentFixture<FormatDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
