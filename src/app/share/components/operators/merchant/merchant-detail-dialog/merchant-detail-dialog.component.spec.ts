import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantDetailDialogComponent } from './merchant-detail-dialog.component';

describe('MerchantDetailDialogComponent', () => {
  let component: MerchantDetailDialogComponent;
  let fixture: ComponentFixture<MerchantDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MerchantDetailDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
