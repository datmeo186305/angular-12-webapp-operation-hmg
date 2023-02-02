import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantQrComponent } from './merchant-qr.component';

describe('MerchantQrComponent', () => {
  let component: MerchantQrComponent;
  let fixture: ComponentFixture<MerchantQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantQrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
