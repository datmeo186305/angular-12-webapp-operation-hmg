import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantElementComponent } from './merchant-element.component';

describe('MerchantElementComponent', () => {
  let component: MerchantElementComponent;
  let fixture: ComponentFixture<MerchantElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
