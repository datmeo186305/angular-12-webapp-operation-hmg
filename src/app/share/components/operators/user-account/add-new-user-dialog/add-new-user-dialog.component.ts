import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-add-new-user-dialog',
  templateUrl: './add-new-user-dialog.component.html',
  styleUrls: ['./add-new-user-dialog.component.scss'],
})
export class AddNewUserDialogComponent implements OnInit {
  addAccountForm: FormGroup;
  isAccountNameInputFocus: boolean = false;
  isLoginInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;
  isPasswordVisible: boolean = false;
  isRePasswordVisible: boolean = false;
  isRePasswordInputFocus: boolean = false;
  isRoleInputFocus: boolean = false;
  isPhoneInputFocus: boolean = false;
  isEmailInputFocus: boolean = false;
  isPositionInputFocus: boolean = false;
  isNoteInputFocus: boolean = false;
  dialogTitle: string;
  userInfo;
  passwordInput: boolean;
  disableUsername: boolean = true;

  roleList;
  positionOptions = {
    fieldName: 'Vị trí công việc',
    options: ['Kiểm duyệt viên', 'BD', 'Operator Admin', 'Kế toán'],
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddNewUserDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildAccountInfoForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  buildAccountInfoForm() {
    this.addAccountForm = this.formBuilder.group({
      accountName: [''],
      username: [''],
      accountPassword: [
        '',
        [Validators.minLength(8), Validators.maxLength(50)],
      ],
      accountRePassword: [''],
      accountRole: [''],
      accountPhone: ['', [Validators.minLength(10), Validators.maxLength(12)]],
      accountEmail: ['', [Validators.email]],
      accountPosition: [''],
      accountNote: [''],
    });
  }

  initDialogData(data) {
    ``;
    this.roleList = data?.roleList;
    this.dialogTitle = data?.dialogTitle;
    this.userInfo = data?.userInfo;
    this.passwordInput = data?.hasPasswordField;
    if (!data?.hasUsernameField) {
      this.addAccountForm.controls.username.disable();
    }

    this.addAccountForm.patchValue({
      accountName: this.userInfo?.fullName,
      username: this.userInfo?.username,
      accountPassword: '',
      accountRePassword: '',
      accountRole: this.userInfo?.groupId,
      accountPhone: this.userInfo?.mobile,
      accountEmail: this.userInfo?.email,
      accountPosition: this.userInfo?.position,
      accountNote: this.userInfo?.note,
    });
  }

  submitForm() {
    this.addAccountForm.markAllAsTouched();

    if (this.addAccountForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.addAccountForm.getRawValue(),
    });
  }

  ngOnInit(): void {}
}
