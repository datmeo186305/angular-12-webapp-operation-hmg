import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStatusDialogComponent } from './product-status-dialog.component';

describe('ProductStatusDialogComponent', () => {
  let component: ProductStatusDialogComponent;
  let fixture: ComponentFixture<ProductStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStatusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
