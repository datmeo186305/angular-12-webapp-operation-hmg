import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import {
  BUTTON_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { PermissionTreeComponent } from '../permission-tree/permission-tree.component';
import { ApiResponseListString } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';
import { GroupControllerService as DashboardGroupControllerService } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss'],
})
export class EditRoleDialogComponent implements OnInit, OnDestroy {
  dialogTitle: string = this.multiLanguageService.instant(
    'system.user_role.add_role'
  );
  treeData;
  updateRoleForm: FormGroup;
  groupId: string;
  isDuplicate: boolean = false;
  activePermissions: string[] = [];
  @ViewChildren('tree') permissionTree: QueryList<PermissionTreeComponent>;
  subManager = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private formBuilder: FormBuilder,
    private multiLanguageService: MultiLanguageService,
    private dashboardGroupControllerService: DashboardGroupControllerService,
    private notificationService: NotificationService,
    private notifier: ToastrService
  ) {
    this.buildAccountInfoForm();
    if (data) {
      this.initDialogData(data);
      this.activePermissions = data?.activePermissions;
      this.groupId = data?.groupId;
      this.isDuplicate = data?.isDuplicate;
      this.dialogTitle = data?.title;
      this.treeData = data?.TREE_DATA;
    }
  }

  ngOnInit(): void {}

  buildAccountInfoForm() {
    this.updateRoleForm = this.formBuilder.group({
      groupName: [''],
    });
  }

  initDialogData(data: any) {
    this.updateRoleForm.patchValue({
      groupName: data?.groupName,
    });
    if (data?.isDuplicate) {
      this.updateRoleForm.controls.groupName.setValue(
        data?.groupName + ' COPY'
      );
    }
    this.getPermissionsByGroupId(data?.groupId);
  }

  getPermissionIdsFromGroup() {
    const arrayPermissionTreeComponent = this.permissionTree.toArray();
    let arrayPermission = [];
    for (let i = 0; i < arrayPermissionTreeComponent.length; i++) {
      if (arrayPermissionTreeComponent[i].totalPermissionSelected().length > 0)
        arrayPermission.push(
          ...arrayPermissionTreeComponent[i].totalPermissionSelected()
        );
    }

    return arrayPermission;
  }

  submitForm() {
    if (this.groupId && !this.isDuplicate) {
      this.updateGroup();
      return;
    }
    this.createGroup();
  }

  createGroup() {
    this.dialogRef.close({
      type: 'CREATE',
      groupName: this.updateRoleForm.controls.groupName.value,
      permissionIds: this.getPermissionIdsFromGroup(),
    });
  }

  updateGroup() {
    this.dialogRef.close({
      type: 'UPDATE',
      groupId: this.groupId,
      groupName: this.updateRoleForm.controls.groupName.value,
      permissionIds: this.getPermissionIdsFromGroup(),
    });
  }

  deleteGroup() {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'system.user_role.delete_role.title'
      ),
      content: this.multiLanguageService.instant(
        'system.user_role.delete_role.content',
        { groupName: this.updateRoleForm.controls.groupName.value || '' }
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((event) => {
      if (event === BUTTON_TYPE.PRIMARY) {
        this.dialogRef.close({
          type: 'DELETE',
          groupId: this.groupId,
          groupName: this.updateRoleForm.controls.groupName.value,
        });
      }
    });
  }

  getPermissionsByGroupId(groupId) {
    if (!groupId) {
      return;
    }
    this.activePermissions = [];
    this.subManager.add(
      this.dashboardGroupControllerService
        .getListPermissionsGroupById(groupId)
        .subscribe((response: ApiResponseListString) => {
          if (
            !response ||
            !response.result ||
            response.responseCode !== RESPONSE_CODE.SUCCESS
          ) {
            this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
            return;
          }

          this.activePermissions = response.result;
        })
    );
  }

  ngOnDestroy(): void {
    if (this.subManager) {
      this.subManager.unsubscribe();
    }
  }
}
