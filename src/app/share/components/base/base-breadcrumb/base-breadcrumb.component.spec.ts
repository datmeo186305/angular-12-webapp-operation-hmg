import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBreadcrumbComponent } from './base-breadcrumb.component';

describe('BaseBreadcrumbComponent', () => {
  let component: BaseBreadcrumbComponent;
  let fixture: ComponentFixture<BaseBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseBreadcrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
