import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSelectFilterComponent } from './search-select-filter.component';

describe('SearchSelectFilterComponent', () => {
  let component: SearchSelectFilterComponent;
  let fixture: ComponentFixture<SearchSelectFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSelectFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
