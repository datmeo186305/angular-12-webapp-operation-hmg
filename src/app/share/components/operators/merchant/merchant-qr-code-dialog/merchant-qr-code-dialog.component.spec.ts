import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantQrCodeDialogComponent } from './merchant-qr-code-dialog.component';

describe('MerchantQrCodeDialogComponent', () => {
  let component: MerchantQrCodeDialogComponent;
  let fixture: ComponentFixture<MerchantQrCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantQrCodeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantQrCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
