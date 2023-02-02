import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWorkflowDialogComponent } from './product-workflow-dialog.component';

describe('ProductWorkflowDialogComponent', () => {
  let component: ProductWorkflowDialogComponent;
  let fixture: ComponentFixture<ProductWorkflowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductWorkflowDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWorkflowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
