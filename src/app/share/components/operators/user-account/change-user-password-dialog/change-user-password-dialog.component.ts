import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-change-user-password-dialog',
  templateUrl: './change-user-password-dialog.component.html',
  styleUrls: ['./change-user-password-dialog.component.scss'],
})
export class ChangeUserPasswordDialogComponent implements OnInit {
  changePassForm: FormGroup;
  isPasswordInputFocus: boolean;
  isPassVisible: boolean;
  isConfirmPassVisible: boolean;
  isConfirmPasswordInputFocus: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<ChangeUserPasswordDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildChangePassForm();
  }

  ngOnInit(): void {}

  buildChangePassForm() {
    this.changePassForm = this.formBuilder.group({
      accountPassword: [
        '',
        [Validators.minLength(8), Validators.maxLength(50)],
      ],
      confirmPassword: [''],
    });
  }

  submitForm() {
    this.changePassForm.markAllAsTouched();

    if (this.changePassForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.changePassForm.getRawValue(),
    });
  }
}
