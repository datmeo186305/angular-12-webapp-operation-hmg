import {
  EditRoleDialogComponent,
  PermissionTreeComponent,
} from '../../../../../share/components';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  ApiResponseListString,
  GroupControllerService as DashboardGroupControllerService,
  GroupEntity,
  PermissionTypeLevelOneResponse,
  PermissionTypeControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import {
  ApiResponseGroupEntity,
  GroupControllerService as IdentityGroupControllerService,
} from '../../../../../../../open-api-modules/identity-api-docs';

import { RESPONSE_CODE } from '../../../../../core/common/enum/operator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit, OnDestroy {
  @Input() treeData: Array<PermissionTypeLevelOneResponse>;
  @Input() roleList: Array<GroupEntity>;
  @Output() updateElementInfo = new EventEmitter();

  selectedRole: string;
  activePermissions: string[] = [];

  _roleId: string;
  @Input()
  get roleId(): string {
    return this._roleId;
  }

  set roleId(value: string) {
    this.selectedRole = value;
    this._roleId = value;
    if (value) {
      this.getPermissionsByGroupId(value);
    }
  }

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private permissionTypeControllerService: PermissionTypeControllerService,
    private dashboardGroupControllerService: DashboardGroupControllerService,
    private identityGroupControllerService: IdentityGroupControllerService,
    private notifier: ToastrService
  ) {}

  @ViewChildren('tree') permissionTree: QueryList<PermissionTreeComponent>;

  ngOnInit(): void {}

  openUpdateDialog(role: GroupEntity) {
    const updateDialogRef = this.dialog.open(EditRoleDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        title: this.multiLanguageService.instant('system.user_role.edit_role'),
        groupName: role?.name,
        groupId: role?.id,
        code: role?.code,
        description: role?.description,
        TREE_DATA: this.treeData,
      },
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === 'UPDATE') {
          this.updateGroup(
            result?.groupName,
            result?.groupId,
            result?.groupName,
            result?.permissionIds,
            result?.description
          );
        }

        if (result && result.type === 'DELETE') {
          this.deleteGroup(result?.groupId, result?.groupName);
        }
      })
    );
  }

  openDuplicateDialog(role: GroupEntity) {
    const updateDialogRef = this.dialog.open(EditRoleDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        title: this.multiLanguageService.instant('system.user_role.add_role'),
        isDuplicate: true,
        groupId: role?.id,
        groupName: role?.name,
        code: role?.code,
        description: role?.description,
        TREE_DATA: this.treeData,
      },
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === 'CREATE') {
          this.createNewGroup(
            result?.groupName,
            result?.groupName,
            result?.permissionIds,
            result?.description
          );
        }
      })
    );
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

  openCreateDialog() {
    const updateDialogRef = this.dialog.open(EditRoleDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        title: this.multiLanguageService.instant('system.user_role.add_role'),
        TREE_DATA: this.treeData,
      },
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === 'CREATE') {
          this.createNewGroup(
            result?.groupName,
            result?.groupName,
            result?.permissionIds,
            result?.description
          );
        }
      })
    );
  }

  createNewGroup(
    code: string,
    groupName: string,
    permissionIds: string[],
    description?: string
  ) {
    this.subManager.add(
      this.identityGroupControllerService
        .createGroup({
          code: code,
          name: groupName,
          description: 'ko có mô tả',
        })
        .subscribe((response: ApiResponseGroupEntity) => {
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

          this.notifier.success(
            this.multiLanguageService.instant(
              'system.user_role.create_success',
              { groupName: groupName }
            )
          );

          this.addPermissionToGroup(
            response.result.id,
            permissionIds,
            groupName
          );
          setTimeout(() => {
            this.updateElementInfo.emit();
            this.getPermissionsByGroupId(response.result.id);
          }, 2000);
        })
    );
  }

  updateGroup(
    code: string,
    groupId: string,
    groupName: string,
    permissionIds: string[],
    description: string
  ) {
    this.subManager.add(
      this.identityGroupControllerService
        .updateGroup(groupId, {
          code: groupName,
          name: groupName,
          description: 'ko có mô tả',
        })
        .subscribe((response) => {
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

          this.notifier.success(
            this.multiLanguageService.instant(
              'system.user_role.update_success',
              { groupName: groupName }
            )
          );
          this.updatePermissionByGroupId(groupId, permissionIds);
          setTimeout(() => {
            this.getPermissionsByGroupId(groupId);
            this.updateElementInfo.emit();
          }, 2000);
        })
    );
  }

  addPermissionToGroup(
    groupId: string,
    permissionIds: string[],
    groupName: string
  ) {
    this.subManager.add(
      this.identityGroupControllerService
        .addPermissions({
          permissionIds: permissionIds,
          groupId: groupId,
        })
        .subscribe((response) => {
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

          this.notifier.success(
            this.multiLanguageService.instant(
              'system.user_role.update_success',
              { groupName: groupName }
            )
          );
        })
    );
  }

  deleteGroup(groupId: string, groupName: string) {
    this.subManager.add(
      this.identityGroupControllerService
        .deleteGroup(groupId)
        .subscribe((response) => {
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

          this.notifier.success(
            this.multiLanguageService.instant(
              'system.user_role.delete_success',
              { groupName: groupName }
            )
          );
          setTimeout(() => {
            this.updateElementInfo.emit();
          }, 2000);
        })
    );
  }

  updatePermissionForGroup() {
    const arrayPermissionTreeComponent = this.permissionTree.toArray();
    let arrayPermission = [];
    for (let i = 0; i < arrayPermissionTreeComponent.length; i++) {
      if (arrayPermissionTreeComponent[i].totalPermissionSelected().length > 0)
        arrayPermission.push(
          ...arrayPermissionTreeComponent[i].totalPermissionSelected()
        );
    }

    this.updatePermissionByGroupId(this.selectedRole, arrayPermission);
  }

  updatePermissionByGroupId(groupId: string, permissionIds: string[]) {
    if (!groupId) {
      return;
    }
    this.subManager.add(
      this.identityGroupControllerService
        .updatePermissions({
          permissionIds: permissionIds,
          groupId: groupId,
        })
        .subscribe((response) => {
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

          this.notifier.success(
            this.multiLanguageService.instant('common.update_success')
          );
          this.updateElementInfo.emit();
        })
    );
  }

  ngOnDestroy(): void {
    if (this.subManager) {
      this.subManager.unsubscribe();
    }
  }
}
