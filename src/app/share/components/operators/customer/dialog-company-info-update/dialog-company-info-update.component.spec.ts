import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCompanyInfoUpdateComponent } from './dialog-company-info-update.component';

describe('DialogCompanyInfoUpdateComponent', () => {
  let component: DialogCompanyInfoUpdateComponent;
  let fixture: ComponentFixture<DialogCompanyInfoUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCompanyInfoUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCompanyInfoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
