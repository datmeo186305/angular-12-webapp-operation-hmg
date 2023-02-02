import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupDialogComponent } from './merchant-group-dialog.component';

describe('MerchantGroupDialogComponent', () => {
  let component: MerchantGroupDialogComponent;
  let fixture: ComponentFixture<MerchantGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
