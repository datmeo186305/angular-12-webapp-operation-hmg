import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserInfoUpdateComponent } from './dialog-user-info-update.component';

describe('DialogUserInfoUpdateComponent', () => {
  let component: DialogUserInfoUpdateComponent;
  let fixture: ComponentFixture<DialogUserInfoUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUserInfoUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserInfoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
