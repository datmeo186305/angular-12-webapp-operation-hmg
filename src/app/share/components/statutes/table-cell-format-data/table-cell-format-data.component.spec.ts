import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellFormatDataComponent } from './table-cell-format-data.component';

describe('TableCellFormatDataComponent', () => {
  let component: TableCellFormatDataComponent;
  let fixture: ComponentFixture<TableCellFormatDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCellFormatDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellFormatDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
