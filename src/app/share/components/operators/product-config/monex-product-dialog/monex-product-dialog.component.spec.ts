import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonexProductDialogComponent } from './monex-product-dialog.component';

describe('MonexProductDialogComponent', () => {
  let component: MonexProductDialogComponent;
  let fixture: ComponentFixture<MonexProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonexProductDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonexProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
