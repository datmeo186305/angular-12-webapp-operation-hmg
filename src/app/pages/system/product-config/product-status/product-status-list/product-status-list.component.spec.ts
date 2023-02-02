import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStatusListComponent } from './product-status-list.component';

describe('ProductStatusListComponent', () => {
  let component: ProductStatusListComponent;
  let fixture: ComponentFixture<ProductStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStatusListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
