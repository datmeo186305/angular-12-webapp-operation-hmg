import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BUTTON_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import {
  AdminAccountEntity,
  ApiResponseSearchAndPaginationResponseGroupEntity,
  GroupControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import {
  AdminAccountControllerService,
  ApiResponseObject,
} from '../../../../../../../open-api-modules/identity-api-docs';
import { PermissionConstants } from '../../../../../core/common/constants/permission-constants';

@Component({
  selector: 'app-dialog-user-info-update',
  templateUrl: './dialog-user-info-update.component.html',
  styleUrls: ['./dialog-user-info-update.component.scss'],
})
export class DialogUserInfoUpdateComponent implements OnInit {
  accountInfoForm: FormGroup;
  changePassForm: FormGroup;
  hasCancelButton: boolean = false;
  isOldPassVisible: boolean;
  isPassVisible: boolean;
  isConfirmPassVisible: boolean;
  isOldPasswordInputFocus: boolean;
  isPasswordInputFocus: boolean;
  isConfirmPasswordInputFocus: boolean;
  isAccountNameInputFocus: boolean = false;
  isPhoneInputFocus: boolean = false;
  isNoteInputFocus: boolean = false;
  subManager = new Subscription();

  roleOptions = [];

  positionOptions = {
    fieldName: 'Vị trí công việc',
    options: ['Kiểm duyệt viên', 'BD', 'Operator Admin', 'Kế toán'],
  };

  constructor(
    private adminAccountControllerService: AdminAccountControllerService,
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogUserInfoUpdateComponent>,
    private groupControllerService: GroupControllerService,
    private permissionsService: NgxPermissionsService,
    private formBuilder: FormBuilder,
    private notifier: ToastrService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.buildAccountInfoForm();
    this.buildChangePassForm();
    // this.getRoleList();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildChangePassForm() {
    this.changePassForm = this.formBuilder.group({
      oldPassword: ['', [Validators.minLength(8), Validators.maxLength(50)]],
      accountPassword: [
        '',
        [Validators.minLength(8), Validators.maxLength(50)],
      ],
      confirmPassword: [''],
    });
  }

  buildAccountInfoForm() {
    this.accountInfoForm = this.formBuilder.group({
      fullName: [''],
      username: [''],
      groupId: [''],
      groupName: [''],
      mobile: [''],
      email: [''],
      position: [''],
      note: [''],
    });
  }

  initDialogData(userInfo: AdminAccountEntity) {
    this.accountInfoForm.patchValue({
      fullName: userInfo?.fullName,
      username: userInfo?.username,
      groupId: userInfo?.groupId,
      groupName: userInfo?.groupEntity?.name,
      mobile: userInfo?.mobile,
      email: userInfo?.email,
      position: userInfo?.position,
      note: userInfo?.note,
    });
  }

  getRoleList() {
    if (
      !this.permissionsService.hasPermission(
        PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_GROUP
      )
    ) {
      return;
    }

    this.subManager.add(
      this.groupControllerService
        .getGroups(100, 0, {})
        .subscribe(
          (result: ApiResponseSearchAndPaginationResponseGroupEntity) => {
            if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
              return this.notifier.error(
                JSON.stringify(result?.message),
                result?.errorCode
              );
            }
            this.roleOptions = result?.result?.data;
          }
        )
    );
  }

  submitForm() {
    this.accountInfoForm.markAllAsTouched();

    if (this.accountInfoForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.accountInfoForm.getRawValue(),
    });
  }

  changePassword() {
    const changePasswordSection = document.getElementById(
      'change-password-section'
    );
    changePasswordSection.style.height = '280px';
    this.hasCancelButton = true;
  }

  cancelChangePassword() {
    const changePasswordSection = document.getElementById(
      'change-password-section'
    );
    changePasswordSection.style.height = '0';
    this.hasCancelButton = false;
  }

  submitChangePassForm() {
    const updateInfoRequest = this.bindDialogChangePass(
      this.changePassForm.getRawValue()
    );
    this.adminAccountControllerService
      .accountAdminChangePassword(updateInfoRequest)
      .subscribe((result: ApiResponseObject) => {
        if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
          return this.notifier.error(
            JSON.stringify(result?.message),
            result?.errorCode
          );
        } else {
          this.notifier.success(
            this.multiLanguageService.instant(
              'account.setting.change_password_toast'
            )
          );
          this.resetValue();
          this.cancelChangePassword();
        }
      });
  }

  resetValue() {
    this.changePassForm.patchValue({
      oldPassword: '',
      accountPassword: '',
      confirmPassword: '',
    });
  }

  bindDialogChangePass(data) {
    return {
      newSecret: data.accountPassword,
      confirmSecret: data.confirmPassword,
      currentSecret: data.oldPassword,
    };
  }
}
