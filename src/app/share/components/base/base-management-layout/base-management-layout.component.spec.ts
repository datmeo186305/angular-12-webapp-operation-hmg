import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseManagementLayoutComponent } from './base-management-layout.component';

describe('BaseManagementLayoutComponent', () => {
  let component: BaseManagementLayoutComponent;
  let fixture: ComponentFixture<BaseManagementLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseManagementLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseManagementLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
