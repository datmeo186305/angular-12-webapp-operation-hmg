import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFilterFormComponent } from './base-filter-form.component';

describe('BaseFilterFormComponent', () => {
  let component: BaseFilterFormComponent;
  let fixture: ComponentFixture<BaseFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseFilterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
