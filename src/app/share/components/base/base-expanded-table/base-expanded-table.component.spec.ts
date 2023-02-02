import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseExpandedTableComponent } from './base-expanded-table.component';

describe('BaseExpandedTableComponent', () => {
  let component: BaseExpandedTableComponent;
  let fixture: ComponentFixture<BaseExpandedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseExpandedTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseExpandedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
