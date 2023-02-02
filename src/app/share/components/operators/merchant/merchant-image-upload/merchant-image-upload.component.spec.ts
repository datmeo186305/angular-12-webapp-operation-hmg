import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantImageUploadComponent } from './merchant-image-upload.component';

describe('MerchantImageUploadComponent', () => {
  let component: MerchantImageUploadComponent;
  let fixture: ComponentFixture<MerchantImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantImageUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
