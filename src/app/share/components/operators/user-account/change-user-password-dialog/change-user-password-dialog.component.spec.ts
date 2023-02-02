import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserPasswordDialogComponent } from './change-user-password-dialog.component';

describe('ChangeUserPasswordDialogComponent', () => {
  let component: ChangeUserPasswordDialogComponent;
  let fixture: ComponentFixture<ChangeUserPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUserPasswordDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUserPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
