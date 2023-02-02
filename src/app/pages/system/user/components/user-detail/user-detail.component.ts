import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { Subscription } from 'rxjs';

import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  MULTIPLE_ELEMENT_ACTION_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {
  AdminAccountControllerService,
  AdminChangePassProviderRequest,
  ApiResponseAdminAccountEntity,
} from '../../../../../../../open-api-modules/identity-api-docs';
import * as moment from 'moment';
import {
  AdminAccountEntity,
  GroupEntity,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import {
  AddNewUserDialogComponent,
  ChangeUserPasswordDialogComponent,
} from '../../../../../share/components';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  leftCompanyInfos: any[] = [];
  rightCompanyInfos: any[] = [];
  subManager = new Subscription();
  _userInfo: AdminAccountEntity;

  @Input() roleList: Array<GroupEntity>;

  @Input()
  get userInfo() {
    return this._userInfo;
  }

  set userInfo(value: AdminAccountEntity) {
    this._userInfo = value;
    this.leftCompanyInfos = this._initLeftCompanyInfos();
    this.rightCompanyInfos = this._initRightCompanyInfos();
  }

  @Output() updateElementInfo = new EventEmitter();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private notifier: ToastrService,
    private adminAccountControllerService: AdminAccountControllerService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subManager) {
      this.subManager.unsubscribe();
    }
  }

  public openUpdateDialog() {
    const updateDialogRef = this.dialog.open(AddNewUserDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        hasUsernameField: false,
        hasPasswordField: false,
        roleList: this.roleList,
        userInfo: this.userInfo,
        dialogTitle: this.multiLanguageService.instant(
          'account.info.update_dialog_title'
        ),
      },
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateInfoRequest = this._bindingDialogIndividualData(
            result.data
          );
          this.updateElementInfo.emit(updateInfoRequest);
        }
      })
    );
  }

  public lockPrompt() {
    const confirmLockRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/Alert.svg',
      title: this.multiLanguageService.instant(
        'system.user_detail.lock_user.title'
      ),
      content: this.multiLanguageService.instant(
        'system.user_detail.lock_user.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.lock'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmLockRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        let now = new Date();
        const unlockTime = new Date(now.getTime() + 999999999 * 1000);
        this.subManager.add(
          this.adminAccountControllerService
            .lockAccountAdmin({
              accountId: this.userInfo.id,
              unLockTime: this.formatTimeSecond(unlockTime),
            })
            .subscribe((result: ApiResponseAdminAccountEntity) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              setTimeout(() => {
                this.updateElementInfo.emit();
                this.notifier.success(
                  this.multiLanguageService.instant('common.lock_success')
                );
              }, 3000);
            })
        );
      }
    });
  }

  public unlockPrompt() {
    const confirmUnlockRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/unlock-dialog.svg',
      title: this.multiLanguageService.instant(
        'customer.individual_info.enable_customer.dialog_title'
      ),
      content: '',
      primaryBtnText: this.multiLanguageService.instant('common.allow'),
      primaryBtnClass: 'btn-primary',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmUnlockRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.adminAccountControllerService
            .unLockAccountAdmin(this.userInfo.id)
            .subscribe((result: ApiResponseAdminAccountEntity) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              if (result.responseCode === 200) {
                this.updateElementInfo.emit();
                setTimeout(() => {
                  this.notifier.success(
                    this.multiLanguageService.instant('common.unlock_success')
                  );
                }, 3000);
              }
            })
        );
      }
    });
  }

  public deletePrompt() {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'system.user_detail.delete_user.title'
      ),
      content: this.multiLanguageService.instant(
        'system.user_detail.delete_user.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.adminAccountControllerService
            .deleteAdminAccount(this.userInfo.id)
            .subscribe((result: ApiResponseAdminAccountEntity) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              if (result.responseCode === 200) {
                this.updateElementInfo.emit(
                  MULTIPLE_ELEMENT_ACTION_TYPE.DELETE
                );
                setTimeout(() => {
                  this.notifier.success(
                    this.multiLanguageService.instant(
                      'system.user_detail.delete_user.toast'
                    )
                  );
                }, 3000);
              }
            })
        );
      }
    });
  }

  formatTimeSecond(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY HH:mm:ss'
    );
  }

  _bindingDialogIndividualData(data) {
    return {
      groupId: data?.accountRole,
      fullName: data?.accountName,
      email: data?.accountEmail,
      mobile: data?.accountPhone,
      note: data?.accountNote,
      position: data?.accountPosition,
    };
  }

  private _initLeftCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant('system.user_detail.name'),
        value: this.userInfo?.fullName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'system.user_detail.login_name'
        ),
        value: this.userInfo?.username,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('system.user_detail.email'),
        value: this.userInfo?.email,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  private _initRightCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant('system.user_detail.phone'),
        value: this.userInfo?.mobile,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      // {
      //   title: this.multiLanguageService.instant('system.user_detail.note'),
      //   value: this.userInfo?.note,
      //   type: DATA_CELL_TYPE.TEXT,
      //   format: null,
      // },
      {
        title: this.multiLanguageService.instant('system.user_detail.status'),
        value: this.userInfo?.userStatus,
        type: DATA_CELL_TYPE.STATUS,
        format: DATA_STATUS_TYPE.USER_STATUS,
      },
    ];
  }

  get userStatus() {
    return this.userInfo?.userStatus;
  }

  public openChangePasswordDialog() {
    const updateDialogRef = this.dialog.open(
      ChangeUserPasswordDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '600px',
        width: '60%',
        data: {},
      }
    );
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          this.changeUserPass({
            username: this.userInfo.username,
            newSecret: result?.data?.accountPassword,
            confirmSecret: result?.data?.confirmPassword,
          });
        }
      })
    );
  }

  private changeUserPass(changePassData: AdminChangePassProviderRequest) {
    this.subManager.add(
      this.adminAccountControllerService
        .changePassAdminAccount({
          username: changePassData.username,
          newSecret: changePassData.newSecret,
          confirmSecret: changePassData.confirmSecret,
        })
        .subscribe((result) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }
          setTimeout(() => {
            this.updateElementInfo.emit();
            this.notifier.success(
              this.multiLanguageService.instant(
                'system.user_detail.change_pass_success'
              )
            );
          }, 500);
        })
    );
  }
}
