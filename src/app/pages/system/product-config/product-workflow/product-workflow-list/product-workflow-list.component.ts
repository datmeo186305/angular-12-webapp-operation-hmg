import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  CompanyControllerService,
  GroupControllerService,
  GroupEntity,
  PermissionTypeControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { TableSelectActionModel } from '../../../../../public/models/external/table-select-action.model';
import { Observable, Subscription } from 'rxjs';
import { BreadcrumbOptionsModel } from '../../../../../public/models/external/breadcrumb-options.model';
import { FilterOptionModel } from '../../../../../public/models/filter/filter-option.model';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  FILTER_ACTION_TYPE,
  FILTER_TYPE,
  MULTIPLE_ELEMENT_ACTION_TYPE,
  QUERY_CONDITION_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import * as _ from 'lodash';
import { DisplayedFieldsModel } from '../../../../../public/models/filter/displayed-fields.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../../core/store';
import * as fromSelectors from '../../../../../core/store';
import * as fromActions from '../../../../../core/store';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { AdminAccountControllerService } from '../../../../../../../open-api-modules/identity-api-docs';
import { MatDialog } from '@angular/material/dialog';
import { UserListService } from '../../../user/user-list/user-list.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { FilterEventModel } from '../../../../../public/models/filter/filter-event.model';
import { FilterActionEventModel } from '../../../../../public/models/filter/filter-action-event.model';
import {
  BaseManagementLayoutComponent,
  ProductWorkflowDialogComponent,
} from '../../../../../share/components';
import * as moment from 'moment';
import { LoanStatusService } from '../../../../../../../open-api-modules/monexcore-api-docs';
import { CustomApiResponse, PDGroup } from '../../../pd-system/pd-interface';

@Component({
  selector: 'app-product-status-flow-list',
  templateUrl: './product-workflow-list.component.html',
  styleUrls: ['./product-workflow-list.component.scss'],
})
export class ProductWorkflowListComponent implements OnInit, OnDestroy {
  roleList: Array<GroupEntity>;
  statusList: any;
  selectButtons: TableSelectActionModel[] = [
    {
      hidden: false,
      action: MULTIPLE_ELEMENT_ACTION_TYPE.DELETE,
      color: 'accent',
      content: this.multiLanguageService.instant('product_workflow.delete'),
      imageSrc: 'assets/img/icon/group-5/svg/trash.svg',
      style: 'background-color: #dc3545;',
    },
    {
      hidden: true,
      action: MULTIPLE_ELEMENT_ACTION_TYPE.LOCK,
      color: 'accent',
      content: this.multiLanguageService.instant(
        'customer.individual_info.lock'
      ),
      imageSrc: 'assets/img/icon/group-5/svg/lock-white.svg',
      style: 'background-color: #dc3545;',
    },
  ];

  subManager = new Subscription();
  tableTitle: string = this.multiLanguageService.instant(
    'product_workflow.list'
  );
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.product_workflow'),
    iconImgSrc: 'assets/img/icon/group-7/svg/setting-green.svg',
    searchPlaceholder: this.multiLanguageService.instant(
      'breadcrumb.search_field.user_list'
    ),
    searchable: false,
    showBtnAdd: true,
    btnAddText: this.multiLanguageService.instant('product_workflow.add'),
    keyword: '',
  };
  filterOptions: FilterOptionModel[] = [
    // {
    //   title: this.multiLanguageService.instant('filter.time'),
    //   type: FILTER_TYPE.DATETIME,
    //   controlName: 'createdAt',
    //   value: null,
    // },
    // {
    //   title: this.multiLanguageService.instant('filter.account_status'),
    //   type: FILTER_TYPE.SELECT,
    //   controlName: 'userStatus',
    //   value: null,
    //   options: [
    //     {
    //       title: this.multiLanguageService.instant('common.all'),
    //       value: null,
    //     },
    //     {
    //       title: this.multiLanguageService.instant('common.active'),
    //       value: AdminAccountEntity.UserStatusEnum.Active,
    //     },
    //     {
    //       title: this.multiLanguageService.instant('common.inactive'),
    //       value: AdminAccountEntity.UserStatusEnum.Locked,
    //     },
    //   ],
    // },
  ];

  allColumns: DisplayedFieldsModel[] = [
    {
      key: 'code',
      title: this.multiLanguageService.instant('product_workflow.code'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'name',
      title: this.multiLanguageService.instant('product_workflow.name'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant('product_workflow.status'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.USER_STATUS,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant('product_workflow.created_at'),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/mm/yyyy hh:mm',
      showed: true,
    },
    {
      key: 'updatedAt',
      title: this.multiLanguageService.instant('product_workflow.updated_at'),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/mm/yyyy hh:mm',
      showed: true,
    },
    {
      key: 'updatedBy',
      title: this.multiLanguageService.instant('product_workflow.updated_by'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
  ];
  info;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;
  filterForm: FormGroup;
  expandedElementId: string;
  expandElementFromLoan;
  hasSelect: boolean = true;
  userInfo: any;
  private readonly routeAllState$: Observable<Params>;

  constructor(
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private permissionTypeControllerService: PermissionTypeControllerService,
    private notifier: ToastrService,
    private companyControllerService: CompanyControllerService,
    private adminAccountControllerService: AdminAccountControllerService,
    private groupControllerService: GroupControllerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private userListService: UserListService,
    private permissionsService: NgxPermissionsService,
    private loanStatusService: LoanStatusService
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);

    this._initFilterForm();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(null));
    // this._initSubscription();
    this._getWorkflowList();
    this._getStatusList();
  }

  private _getStatusList() {
    this.subManager.add(
      this.loanStatusService
        .statusGroupControllerGetListStatus()
        .subscribe((data) => {
          this.statusList = data.result;
          this.statusList = this.statusList.map((item) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
        })
    );
  }

  private _getWorkflowList() {
    this.subManager.add(
      this.loanStatusService
        .loanStatusControllerGetListStatusGroup()
        .subscribe((data) => {
          // @ts-ignore
          this.dataSource.data = data?.result;
        })
    );
  }

  // private async _checkActionPermissions() {
  //   const hasCredentialsCreatePermission =
  //     await this.permissionsService.hasPermission('credentials:create');
  //   const hasDeleteAccountPermission =
  //     await this.permissionsService.hasPermission(
  //       'credentials:deleteAdminAccount'
  //     );
  //   const hasLockMultipleAccountPermission =
  //     await this.permissionsService.hasPermission(
  //       'credentials:lockMultiAccount'
  //     );
  //
  //   if (hasCredentialsCreatePermission) {
  //     this.breadcrumbOptions.showBtnAdd = true;
  //   }
  //   this.breadcrumbOptions.showBtnAdd = true;
  //
  //   let selectedButtons = JSON.parse(JSON.stringify(this.selectButtons));
  //   selectedButtons.forEach((button) => {
  //     if (button.action === MULTIPLE_ELEMENT_ACTION_TYPE.DELETE) {
  //       button.hidden = !hasDeleteAccountPermission;
  //       return;
  //     }
  //     if (button.action === MULTIPLE_ELEMENT_ACTION_TYPE.LOCK) {
  //       button.hidden = !hasLockMultipleAccountPermission;
  //     }
  //   });
  //
  //   this.selectButtons = selectedButtons;
  // }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._onFilterChange();
  }

  public onSortChange(sortState: Sort) {
    this.filterForm.controls.orderBy.setValue(sortState.active);
    this.filterForm.controls.sortDirection.setValue(sortState.direction);
    this._onFilterChange();
  }

  public onExpandElementChange(element: any) {
    this.openUpdateDialog(element);
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this.pageIndex = 0;
    this._onFilterChange();
  }

  public onFilterFormChange(event: FilterEventModel) {
    console.log('FilterEventModel', event);
    this.pageIndex = 0;

    switch (event.type) {
      case FILTER_TYPE.DATETIME:
        this.filterForm.controls.startTime.setValue(event.value.startDate);
        this.filterForm.controls.endTime.setValue(event.value.endDate);
        this.filterForm.controls.dateFilterType.setValue(event.value.type);
        this.filterForm.controls.dateFilterTitle.setValue(event.value.title);
        break;
      case FILTER_TYPE.MULTIPLE_CHOICE:
        if (event.controlName === 'groupId') {
          this.filterForm.controls.groupId.setValue(
            event.value ? event.value.join(',') : ''
          );
          if (_.isEmpty(event.value)) {
            this.changeActionSelectAllGroupTitle(
              this.multiLanguageService.instant('filter.select_all')
            );
          } else {
            this.changeActionSelectAllGroupTitle(
              this.multiLanguageService.instant('filter.deselect_all')
            );
          }
        }
        break;
      case FILTER_TYPE.SELECT:
        if (event.controlName === 'userStatus') {
          this.filterForm.controls.userStatus.setValue(
            event.value ? event.value : ''
          );
        }
        break;
      default:
        break;
    }
    this._onFilterChange();
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {
    console.log('FilterActionEventModel', event);
    if (event.type === FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION) {
      if (event.controlName === 'groupId') {
        this.handleFilterActionTriggerGroupId(event);
      }
    }
  }

  private handleFilterActionTriggerGroupId(event: FilterActionEventModel) {
    if (event.actionControlName === 'SELECT_ALL_GROUP') {
      let groupIdValue = null;

      if (_.isEmpty(event.value)) {
        groupIdValue = this.roleList.map((role) => {
          return role.id;
        });
        this.changeActionSelectAllGroupTitle(
          this.multiLanguageService.instant('filter.deselect_all')
        );
      } else {
        this.changeActionSelectAllGroupTitle(
          this.multiLanguageService.instant('filter.select_all')
        );
      }

      this.onFilterFormChange({
        type: FILTER_TYPE.MULTIPLE_CHOICE,
        controlName: 'groupId',
        value: groupIdValue,
      });
    }
  }

  private changeActionSelectAllGroupTitle(title: string) {
    this.filterOptions.forEach((filterOption) => {
      if (filterOption.controlName === 'groupId') {
        filterOption.titleAction =
          title || this.multiLanguageService.instant('filter.select_all');
      }
    });
  }

  @ViewChild(BaseManagementLayoutComponent)
  child: BaseManagementLayoutComponent;

  triggerDeselectUsers() {
    this.child.triggerDeselectUsers();
  }

  public onOutputAction(event) {
    const action = event.action;
    const list = event.selectedList;
    const idArr = list.map((user) => user.id);
    switch (action) {
      case MULTIPLE_ELEMENT_ACTION_TYPE.LOCK:
        this.lockMultiplePrompt(idArr);
        break;
      case MULTIPLE_ELEMENT_ACTION_TYPE.DELETE:
        this.deleteMultiplePrompt(idArr);
        break;
      default:
        return;
    }
  }

  public lockMultiplePrompt(ids) {
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
        this._doMultipleAction(ids, MULTIPLE_ELEMENT_ACTION_TYPE.LOCK);
      }
    });
  }

  public _doMultipleAction(ids, action) {
    if (!ids) {
      return;
    }
    ids.forEach((id) => {
      if (action === MULTIPLE_ELEMENT_ACTION_TYPE.LOCK) {
        this._lockById(id);
      } else {
        this._deleteById(id);
      }
    });
    setTimeout(() => {
      if (action === MULTIPLE_ELEMENT_ACTION_TYPE.DELETE) {
        this.notifier.success(
          this.multiLanguageService.instant('product_workflow.delete_success')
        );
        this.refreshContent();
      }
    }, 2000);
  }

  private _lockById(id: string) {
    if (!id) {
      return;
    }
  }

  public deleteMultiplePrompt(ids) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant('product_workflow.delete'),
      content: this.multiLanguageService.instant(
        'product_workflow.delete_content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this._doMultipleAction(ids, MULTIPLE_ELEMENT_ACTION_TYPE.DELETE);
      }
    });
  }

  private _deleteById(id: string) {
    if (!id) {
      return;
    }
    this.subManager.add(
      this.loanStatusService
        .loanStatusControllerDeleteStatusGroup(id, {})
        .subscribe((result: CustomApiResponse<PDGroup>) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }
        })
    );
  }

  formatTimeSecond(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY HH:mm:ss'
    );
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      id: [''],
      keyword: [''],
      groupId: [''],
      userStatus: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        groupId: QUERY_CONDITION_TYPE.IN,
        userStatus: QUERY_CONDITION_TYPE.EQUAL,
      },
    });
  }

  // private _initSubscription() {
  //   this.subManager.add(
  //     this.routeAllState$.subscribe((params) => {
  //       this._parseQueryParams(params?.queryParams);
  //     })
  //   );
  //
  //   this.subManager.add(
  //     this.permissionsService.permissions$.subscribe((permissions) => {
  //       if (permissions) {
  //         this._checkActionPermissions();
  //       }
  //     })
  //   );
  // }

  private _parseQueryParams(params) {
    this._initFilterFormFromQueryParams(params);
    this._initFilterOptionsFromQueryParams(params);

    this.breadcrumbOptions.keyword = params.keyword;
    this.pageIndex = params.pageIndex || 0;
    this.pageSize = params.pageSize || 20;
  }

  private _initFilterFormFromQueryParams(params) {
    let filterConditionsValue =
      this.filterForm.controls.filterConditions?.value;
    if (_.isEmpty(params)) {
      this._resetFilterForm();
      this._resetFilterOptions();
    }

    for (const [param, paramValue] of Object.entries(params)) {
      let paramHasCondition = param.split('__');
      if (paramHasCondition.length > 1) {
        this.filterForm.controls[paramHasCondition[0]]?.setValue(
          paramValue || ''
        );
        filterConditionsValue[paramHasCondition[0]] =
          '__' + paramHasCondition[1];
      } else {
        if (this.filterForm.controls[param]) {
          this.filterForm.controls[param]?.setValue(paramValue || '');
        }
      }
    }

    this.filterForm.controls.filterConditions.setValue(filterConditionsValue);
  }

  private _initFilterOptionsFromQueryParams(params) {
    this.filterOptions.forEach((filterOption) => {
      if (filterOption.type === FILTER_TYPE.DATETIME) {
        filterOption.value = {
          type: params.dateFilterType,
          title: params.dateFilterTitle,
        };
      } else if (filterOption.controlName === 'groupId') {
        filterOption.value = this.filterForm.controls.groupId.value
          ? this.filterForm.controls.groupId.value.split(',')
          : [];
      } else if (filterOption.controlName === 'userStatus') {
        filterOption.value = this.filterForm.controls.userStatus.value
          ? this.filterForm.controls.userStatus.value
          : null;
      }
    });
  }

  private _buildParams() {
    const data = this.filterForm.getRawValue();
    data.offset = this.pageIndex * this.pageSize;
    data.limit = this.pageSize;
    data.pageIndex = this.pageIndex;
    return data;
  }

  private _parseData(rawData) {
    this.pageLength = rawData?.pagination?.maxPage || 0;
    this.totalItems = rawData?.pagination?.total || 0;
    this.dataSource.data = rawData?.data || [];
  }

  private _onFilterChange() {
    const data = this.filterForm.getRawValue();
    console.log('_onFilterChange', data);
    //convert time to ISO and set end time
    let queryParams = {};
    for (const [formControlName, queryCondition] of Object.entries(
      data.filterConditions
    )) {
      queryParams[formControlName + queryCondition || ''] = data[
        formControlName
      ]
        ? data[formControlName].trim()
        : '';
    }
    queryParams['startTime'] = data.startTime;
    queryParams['endTime'] = data.endTime;
    queryParams['dateFilterType'] = data.dateFilterType;
    queryParams['dateFilterTitle'] = data.dateFilterTitle;
    queryParams['orderBy'] = data.orderBy;
    queryParams['sortDirection'] = data.sortDirection;
    queryParams['pageIndex'] = this.pageIndex;
    queryParams['pageSize'] = this.pageSize;
    queryParams['keyword'] = data.keyword;
    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
      })
      .then((r) => {});
  }

  onClickBtnAdd(event) {
    const dialogRef = this.dialog.open(ProductWorkflowDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '1200px',
      width: '90%',
      data: {
        leftArr: this.statusList,
        dialogTitle: this.multiLanguageService.instant('product_workflow.add'),
      },
    });
    this.subManager.add(
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let createRequest = this._bindingDialogData(result.data, 'create');
          let addRequest = this._bindingDialogData(result.data.addArr);
          this.sendCreateRequest(createRequest, addRequest);
        }
      })
    );
  }

  public sendCreateRequest(createRequest, addRequest) {
    this.subManager.add(
      this.loanStatusService
        .loanStatusControllerCreateStatusGroup(createRequest)
        .subscribe((result: CustomApiResponse<any>) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          } else {
            if (addRequest) {
              for (let i = 0; i < addRequest.length; i++) {
                this.loanStatusService
                  .loanStatusControllerUpdateStatusFlow(
                    result.result.id,
                    'add',
                    addRequest[i]
                  )
                  .subscribe((result) => {});
              }
            }
          }

          setTimeout(() => {
            this.notifier.success(
              this.multiLanguageService.instant(
                'product_workflow.create_success'
              )
            );
            this.refreshContent();
            this.notificationService.hideLoading();
          }, 3000);
        })
    );
  }

  public openUpdateDialog(info) {
    let leftArr = [...this.statusList];
    let rightArr = [];
    let statusFlows = info.statusFlows;
    if (statusFlows) {
      // statusFlows = statusFlows.filter(
      //   (statusFlow) => statusFlow.pdQuestion !== null
      // );
      rightArr = statusFlows.map((ele) => {
        return {
          id: ele.loanStatus.id,
          name: ele.loanStatus.name,
          order: ele.order,
        };
      });
      let ids = rightArr.map((ele) => ele.id);
      leftArr = leftArr.filter((ele) => !ids.includes(ele.id));
    }

    const dialogRef = this.dialog.open(ProductWorkflowDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '1200px',
      width: '90%',
      data: {
        info: info,
        leftArr: leftArr,
        rightArr: rightArr,
        dialogTitle: this.multiLanguageService.instant(
          'product_workflow.update'
        ),
      },
    });
    this.subManager.add(
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateRequest = this._bindingDialogData(result.data, 'create');
          let addQuestionsRequest = this._bindingDialogData(result.data.addArr);
          let updateQuestionsRequest = this._bindingDialogData(
            result.data.updateArr
          );
          let removeQuestionsRequest = this._bindingDialogData(
            result.data.removeArr
          );
          this.sendUpdateRequest(
            info.id,
            updateRequest,
            addQuestionsRequest,
            updateQuestionsRequest,
            removeQuestionsRequest
          );
        }
      })
    );
  }

  public sendUpdateRequest(
    id,
    update,
    addRequest?,
    updateRequest?,
    removeRequest?
  ) {
    this.subManager.add(
      this.loanStatusService
        .loanStatusControllerUpdateStatusGroup(id, update)
        .subscribe((result: CustomApiResponse<PDGroup>) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          } else {
            if (addRequest) {
              for (let i = 0; i < addRequest.length; i++) {
                this.loanStatusService
                  .loanStatusControllerUpdateStatusFlow(
                    id,
                    'add',
                    addRequest[i]
                  )
                  .subscribe((result) => {});
              }
            }
            if (updateRequest) {
              for (let i = 0; i < updateRequest.length; i++) {
                this.loanStatusService
                  .loanStatusControllerUpdateStatusFlow(
                    id,
                    'update',
                    updateRequest[i]
                  )
                  .subscribe((result) => {});
              }
            }
            if (removeRequest) {
              for (let i = 0; i < removeRequest.length; i++) {
                this.loanStatusService
                  .loanStatusControllerUpdateStatusFlow(
                    id,
                    'remove',
                    removeRequest[i]
                  )
                  .subscribe((result) => {});
              }
            }
          }

          setTimeout(() => {
            this.notifier.success(
              this.multiLanguageService.instant('common.update_success')
            );
            this.refreshContent();
            this.notificationService.hideLoading();
          }, 3000);
        })
    );
  }

  public refreshContent() {
    setTimeout(() => {
      this._getWorkflowList();
      this.triggerDeselectUsers();
    }, 2000);
  }

  private _bindingDialogData(data, type?) {
    if (type === 'create') {
      return {
        code: data?.code,
        name: data?.name,
        description: data?.description ? data?.description : null,
      };
    } else {
      let requestArray = [];
      for (let i = 0; i < data.length; i++) {
        requestArray.push({
          statusId: data[i].id,
          order: data[i].order,
        });
      }
      return requestArray;
    }
  }

  private _resetFilterForm() {
    this.filterForm.patchValue({
      id: '',
      keyword: '',
      groupId: '',
      userStatus: '',
      orderBy: 'createdAt',
      sortDirection: 'desc',
      startTime: null,
      endTime: null,
      dateFilterType: '',
      dateFilterTitle: '',
      filterConditions: {
        groupId: QUERY_CONDITION_TYPE.IN,
        userStatus: QUERY_CONDITION_TYPE.EQUAL,
      },
    });
  }

  private _resetFilterOptions() {
    let newFilterOptions = JSON.parse(JSON.stringify(this.filterOptions));
    newFilterOptions.forEach((filterOption) => {
      filterOption.value = null;
    });
    this.filterOptions = newFilterOptions;
  }

  ngOnDestroy(): void {
    if (this.subManager !== null) {
      this.subManager.unsubscribe();
    }
  }
}
