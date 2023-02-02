import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AdminAccountControllerService,
  AdminAccountEntity,
  ApiResponseAdminAccountEntity,
  CustomerInfo,
  GroupEntity,
  PermissionTypeLevelOneResponse,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';
import { AdminAccountControllerService as AdminAccountControllerService1 } from '../../../../../../../open-api-modules/identity-api-docs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  MULTIPLE_ELEMENT_ACTION_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-user-element',
  templateUrl: './user-element.component.html',
  styleUrls: ['./user-element.component.scss'],
})
export class UserElementComponent implements OnInit {
  @Input() roleList: Array<GroupEntity>;
  @Input() treeData: Array<PermissionTypeLevelOneResponse>;
  @Output() triggerUpdateElementInfo = new EventEmitter();
  @Output() triggerUpdateRoleInfo = new EventEmitter();

  @Input() userInfo: AdminAccountEntity;
  private _userId;
  @Input()
  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private notifier: ToastrService,
    private adminAccountControllerService: AdminAccountControllerService,
    private identityAdminAccountControllerService: AdminAccountControllerService1
  ) {}

  ngOnInit(): void {
    // this._getUserInfoById(this.userId);
  }

  public reloadRoleInfo() {
    this.triggerUpdateRoleInfo.emit();
  }

  public refreshContent() {
    setTimeout(() => {
      this._getUserInfoById(this.userId);
    }, 2000);
  }

  private _getUserInfoById(userId) {
    if (!userId) return;
    this.subManager.add(
      this.adminAccountControllerService
        .getAdminAccountById(this.userId)
        .subscribe((data: ApiResponseAdminAccountEntity) => {
          if (!data || data.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(JSON.stringify(data?.message), data?.errorCode);
            return;
          }
          if (data.responseCode === 200) {
            this.userInfo = data?.result;
            this.triggerUpdateElementInfo.emit(this.userInfo);
          }
        })
    );
  }

  private updateUserInfo(updateInfoRequest) {
    this.subManager.add(
      this.identityAdminAccountControllerService
        .updateFullInfoAdminAccount(this.userId, updateInfoRequest)
        .subscribe((data: ApiResponseAdminAccountEntity) => {
          if (!data || data.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(data?.message),
              data?.errorCode
            );
          }
          if (data.responseCode === 200) {
            this.refreshContent();
            setTimeout(() => {
              this.notifier.success(
                this.multiLanguageService.instant('common.update_success')
              );
            }, 500);
          }
        })
    );
  }

  updateElementInfo(updateInfoRequest) {
    if (!updateInfoRequest) {
      this.refreshContent();
    } else if (updateInfoRequest === MULTIPLE_ELEMENT_ACTION_TYPE.DELETE) {
      this.triggerUpdateElementInfo.emit();
    } else {
      this.updateUserInfo(updateInfoRequest);
    }
  }
}
