import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeFilterComponent } from './datetime-filter.component';

describe('DatetimeFilterComponent', () => {
  let component: DatetimeFilterComponent;
  let fixture: ComponentFixture<DatetimeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatetimeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
