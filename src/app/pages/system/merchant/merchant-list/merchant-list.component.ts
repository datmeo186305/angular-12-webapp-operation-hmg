import { PermissionConstants } from 'src/app/core/common/constants/permission-constants';
import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import {
  AdminControllerService,
  ApiResponseMerchant,
  ApiResponseString,
  CreateMerchantRequestDto,
  MerchantStatus,
} from '../../../../../../open-api-modules/bnpl-api-docs';
import {
  ApiResponseSearchAndPaginationResponseAdminAccountEntity,
  ApiResponseSearchAndPaginationResponseMerchant,
  Merchant,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  FILTER_TYPE,
  MULTIPLE_ELEMENT_ACTION_TYPE,
  NAV_ITEM,
  QUERY_CONDITION_TYPE,
  RESPONSE_CODE,
} from '../../../../core/common/enum/operator';
import { NotificationService } from '../../../../core/services/notification.service';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import * as fromSelectors from '../../../../core/store/selectors';
import { BreadcrumbOptionsModel } from '../../../../public/models/external/breadcrumb-options.model';
import { OverviewItemModel } from '../../../../public/models/external/overview-item.model';
import { TableSelectActionModel } from '../../../../public/models/external/table-select-action.model';
import { DisplayedFieldsModel } from '../../../../public/models/filter/displayed-fields.model';
import { FilterActionEventModel } from '../../../../public/models/filter/filter-action-event.model';
import { FilterEventModel } from '../../../../public/models/filter/filter-event.model';
import { FilterOptionModel } from '../../../../public/models/filter/filter-option.model';
import {
  BaseManagementLayoutComponent,
  MerchantDetailDialogComponent,
} from '../../../../share/components';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { MerchantListService } from './merchant-list.service';

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrls: ['./merchant-list.component.scss'],
})
export class MerchantListComponent implements OnInit, OnDestroy {
  bdList: any[] = [];
  managerList: any[] = [];
  merchantParentList: any[] = [];
  allMerchant: any[] = [];
  userHasPermissions = {
    bdStaffOptions: false,
  };

  allColumns: DisplayedFieldsModel[] = [
    {
      key: 'code',
      title: this.multiLanguageService.instant('merchant.merchant_list.id'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'name',
      title: this.multiLanguageService.instant('merchant.merchant_list.name'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'mobile',
      title: this.multiLanguageService.instant('merchant.merchant_list.phone'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'email',
      title: this.multiLanguageService.instant('merchant.merchant_list.email'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'productTypes',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.product'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant('merchant.merchant_list.status'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.USER_STATUS,
      showed: true,
    },
    {
      key: 'adminAccountEntity.username',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.merchant_manager'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.create_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy hh:mm:ss',
      showed: true,
    },
    {
      key: 'updatedAt',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.updated_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy hh:mm:ss',
      showed: true,
    },
    {
      key: 'userName',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.updated_by'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'address',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.location'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'merchantServiceFee',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.merchant_fee'
      ),
      type: DATA_CELL_TYPE.PERCENT,
      format: null,
      showed: false,
    },
    {
      key: 'customerServiceFee',
      title: this.multiLanguageService.instant(
        'merchant.merchant_list.customer_fee'
      ),
      type: DATA_CELL_TYPE.PERCENT,
      format: null,
      showed: false,
    },
  ];
  tableTitle: string = this.multiLanguageService.instant(
    'merchant.merchant_list.title'
  );
  overviewItems: OverviewItemModel[] = [
    {
      field: this.multiLanguageService.instant('merchant.total_merchant'),
      value: 0,
    },
  ];
  hasSelect: boolean = true;
  selectButtons: TableSelectActionModel[] = [
    {
      hidden: false,
      action: MULTIPLE_ELEMENT_ACTION_TYPE.DELETE,
      color: 'accent',
      content: this.multiLanguageService.instant(
        'merchant.merchant_list.delete_merchant'
      ),
      imageSrc: 'assets/img/icon/group-5/svg/trash.svg',
      style: 'background-color: #dc3545;',
    },
    {
      hidden: false,
      action: MULTIPLE_ELEMENT_ACTION_TYPE.LOCK,
      color: 'accent',
      content: this.multiLanguageService.instant(
        'customer.individual_info.lock'
      ),
      imageSrc: 'assets/img/icon/group-5/svg/lock-white.svg',
      style: 'background-color: #dc3545;',
    },
  ];
  private readonly routeAllState$: Observable<Params>;
  totalItems: number = 0;
  filterForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  expandedElementId: string;
  expandedElementMerchant: Merchant;
  forceElementMerchant: Merchant;
  merchantInfo: any;
  subscription = new Subscription();
  subManager = new Subscription();
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.merchant'),
    iconImgSrc: 'assets/img/icon/group-7/svg/merchant.svg',
    searchPlaceholder:
      'Tên merchant, Số điện thoại, Email, Mã merchant, Tên Admin, Ngành hàng…',
    searchable: true,
    showBtnAdd: true,
    btnAddText: this.multiLanguageService.instant(
      'merchant.merchant_list.add_merchant'
    ),
    keyword: '',
  };
  filterOptions: FilterOptionModel[] = [
    {
      title: this.multiLanguageService.instant('filter.time'),
      type: FILTER_TYPE.DATETIME,
      controlName: 'createdAt',
      value: null,
    },
    {
      title: this.multiLanguageService.instant('filter.merchant_parent'),
      type: FILTER_TYPE.SEARCH_SELECT,
      controlName: 'merchantParentId',
      value: null,
      options: [],
      multiple: true,
      searchPlaceholder: this.multiLanguageService.instant(
        'merchant.merchant_list.search_merchant_parent'
      ),
      emptyResultText: this.multiLanguageService.instant(
        'merchant.merchant_list.empty_merchant_parent'
      ),
    },
    {
      title: this.multiLanguageService.instant('filter.bd'),
      type: FILTER_TYPE.SEARCH_SELECT,
      controlName: 'bdStaffId',
      value: null,
      options: [],
      hidden: true,
      multiple: true,
      searchPlaceholder: this.multiLanguageService.instant(
        'merchant.merchant_list.search_bd_staff'
      ),
      emptyResultText: this.multiLanguageService.instant(
        'merchant.merchant_list.empty_bd_staff'
      ),
    },
    {
      title: this.multiLanguageService.instant('filter.merchant_status'),
      type: FILTER_TYPE.SELECT,
      controlName: 'status',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: null,
        },
        {
          title: this.multiLanguageService.instant('common.active'),
          value: MerchantStatus.Active,
        },
        {
          title: this.multiLanguageService.instant('common.inactive'),
          value: MerchantStatus.Locked,
        },
        // {
        //   title: this.multiLanguageService.instant('common.locked'),
        //   value: MerchantStatus.Locked,
        // },
      ],
    },
  ];

  constructor(
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private adminControllerService: AdminControllerService,
    private merchantListService: MerchantListService,
    private permissionsService: NgxPermissionsService
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.MERCHANT));
    this._initOptions();
    this._initSubscription();
  }
  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  private _getMerchantList() {
    const params = this._buildParams();
    this.merchantListService
      .getData(params)
      .subscribe((data: ApiResponseSearchAndPaginationResponseMerchant) => {
        this._parseData(data?.result);
        this.getOverviewData(data?.result);
        this.dataSource.data = data?.result?.data;
        if (this.filterForm.controls.id?.value) {
          this.forceElementMerchant = data?.result?.data.find((value) => {
            return value.id === this.filterForm.controls.id?.value;
          });
        }
      });
  }

  public onSortChange(sortState: Sort) {
    this.filterForm.controls.orderBy.setValue(sortState.active);
    this.filterForm.controls.sortDirection.setValue(sortState.direction);
    this._onFilterChange();
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this.pageIndex = 0;
    this._onFilterChange();
  }

  public onFilterFormChange(event: FilterEventModel) {
    console.log('FilterEventModel', event);
    switch (event.type) {
      case FILTER_TYPE.DATETIME:
        this.filterForm.controls.startTime.setValue(event.value.startDate);
        this.filterForm.controls.endTime.setValue(event.value.endDate);
        this.filterForm.controls.dateFilterType.setValue(event.value.type);
        this.filterForm.controls.dateFilterTitle.setValue(event.value.title);
        break;
      case FILTER_TYPE.MULTIPLE_CHOICE:
        break;
      case FILTER_TYPE.SELECT:
        if (event.controlName === 'status') {
          this.filterForm.controls.status.setValue(event.value || null);
        }
        break;
      case FILTER_TYPE.SEARCH_SELECT:
        if (event.controlName === 'bdStaffId') {
          this.filterForm.controls.bdStaffId.setValue(
            event.value ? event.value.join(',') : ''
          );
        } else if (event.controlName === 'merchantParentId') {
          this.filterForm.controls.merchantParentId.setValue(
            event.value ? event.value.join(',') : ''
          );
        }
        break;
      default:
        break;
    }
    this._onFilterChange();
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      id: [''],
      keyword: [''],
      bdStaffId: [''],
      merchantParentId: [''],
      status: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        bdStaffId: QUERY_CONDITION_TYPE.IN,
        merchantParentId: QUERY_CONDITION_TYPE.IN,
        status: QUERY_CONDITION_TYPE.EQUAL,
      },
    });
  }

  private _resetFilterForm() {
    this.filterForm = this.formBuilder.group({
      id: [''],
      keyword: [''],
      bdStaffId: [''],
      merchantParentId: [''],
      status: [''],
      productTypes: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        bdStaffId: QUERY_CONDITION_TYPE.IN,
        merchantParentId: QUERY_CONDITION_TYPE.IN,
        status: QUERY_CONDITION_TYPE.EQUAL,
      },
    });
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        if (params?.url.includes(window.location.pathname)) {
          this._parseQueryParams(params?.queryParams);
          this._getMerchantList();
        } else {
          this.dataSource.data = [];
        }
      })
    );

    this.subManager.add(
      this.permissionsService.permissions$.subscribe((permissions) => {
        if (permissions) {
          this._checkUserPermisstion();
        }
      })
    );
  }

  private async _checkUserPermisstion() {
    await this._checkPermissions();
    if (this.userHasPermissions.bdStaffOptions) {
      this._getBDList();
      this.filterOptions.forEach((option) => {
        if (option.controlName === 'bdStaffId') {
          option.hidden = false;
        }
      });
    }
  }

  private async _checkPermissions() {
    this.userHasPermissions.bdStaffOptions =
      await this.permissionsService.hasPermission(
        PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_ADMIN_ACCOUNT
      );
  }

  private _parseQueryParams(params) {
    this._initFilterFormFromQueryParams(params);
    this._initFilterOptionsFromQueryParams(params);

    this.breadcrumbOptions.keyword = params.keyword;
    this.pageIndex = params.pageIndex || 0;
    this.pageSize = params.pageSize || 10;
  }

  getOverviewData(rawData) {
    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant('merchant.total_merchant')
    ).value = rawData?.pagination?.total;
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
      } else if (filterOption.controlName === 'merchantParentId') {
        filterOption.value = this.filterForm.controls.merchantParentId.value
          ? this.filterForm.controls.merchantParentId.value.split(',')
          : [];
      } else if (filterOption.controlName === 'bdStaffId') {
        filterOption.value = this.filterForm.controls.bdStaffId.value
          ? this.filterForm.controls.bdStaffId.value.split(',')
          : [];
      } else if (filterOption.controlName === 'status') {
        filterOption.value = this.filterForm.controls.status.value
          ? this.filterForm.controls.status.value
          : null;
      }
    });
  }

  private _resetFilterOptions() {
    let newFilterOptions = JSON.parse(JSON.stringify(this.filterOptions));
    newFilterOptions.forEach((filterOption) => {
      filterOption.value = null;
    });
    this.filterOptions = newFilterOptions;
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

  @ViewChild(BaseManagementLayoutComponent)
  child: BaseManagementLayoutComponent;

  triggerDeselectUsers() {
    this.child.triggerDeselectUsers();
  }

  public onOutputAction(event) {
    const action = event.action;
    const list = event.selectedList;
    const idArr = list.map((merchant) => merchant.id);
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

  private _initOptions() {
    this._getAllMerchant();
  }

  private _getBDList() {
    this.subManager.add(
      this.merchantListService
        .getUserList()
        .subscribe(
          (
            response: ApiResponseSearchAndPaginationResponseAdminAccountEntity
          ) => {
            if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
              return this.notifier.error(
                JSON.stringify(response?.message),
                response?.errorCode
              );
            }

            this.managerList = response?.result?.data.map((bd) => {
              return {
                ...bd,
                title: bd.username,
                value: bd.id,
              };
            });

            let bdStaffOptions = this.managerList.filter((value) => {
              return value.position == 'BD';
            });

            this.filterOptions.forEach((filterOption: FilterOptionModel) => {
              if (filterOption.controlName !== 'bdStaffId') {
                return;
              }

              filterOption.options = bdStaffOptions;
              this.bdList = bdStaffOptions;
            });

            this.filterOptions = JSON.parse(JSON.stringify(this.filterOptions));
          }
        )
    );
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
  }

  private _lockById(id: string) {
    if (!id) {
      return;
    }
    this.subManager.add(
      this.adminControllerService
        .v1AdminMerchantsIdPut(id, { status: 'LOCKED' })
        .subscribe(
          (result: ApiResponseMerchant) => {
            if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
              return this.notifier.error(
                JSON.stringify(result?.message),
                result?.errorCode
              );
            }

            this.notifier.success(
              this.multiLanguageService.instant(
                'merchant.merchant_detail.lock_merchant.toast'
              )
            );
          },
          (error) => {},
          () => {
            setTimeout(() => {
              this.triggerDeselectUsers();
              this.refreshContent();
            }, 3000);
          }
        )
    );
  }

  public deleteMultiplePrompt(ids) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'merchant.merchant_detail.delete_merchant.title'
      ),
      content: this.multiLanguageService.instant(
        'merchant.merchant_detail.delete_merchant.content'
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
      this.adminControllerService.v1AdminMerchantsIdDelete(id).subscribe(
        (result: ApiResponseString) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }

          this.notifier.success(
            this.multiLanguageService.instant(
              'merchant.merchant_detail.delete_merchant.toast'
            )
          );
        },
        (error) => {},
        () => {
          setTimeout(() => {
            this.triggerDeselectUsers();
            this.refreshContent();
          }, 3000);
        }
      )
    );
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._onFilterChange();
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {}

  public onExpandElementChange(element: any) {
    this.expandedElementId = element.id;
    this.expandedElementMerchant = element;
  }

  public onRefreshTrigger(event) {
    this._getMerchantList();
  }

  onClickBtnAdd(event) {
    const addMerchantDialogRef = this.dialog.open(
      MerchantDetailDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '1200px',
        width: '90%',
        data: {
          merchantInfo: this.merchantInfo,
          bdStaffOptions: this.bdList,
          managerOptions: this.managerList,
          isCreateMode: true,
          allMerchant: this.allMerchant,
        },
      }
    );
    this.subManager.add(
      addMerchantDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let createRequest = this._bindingDialogData(result.data);
          this.sendAddRequest(createRequest);
        }
      })
    );
  }

  sendAddRequest(addRequest: CreateMerchantRequestDto) {
    this.subManager.add(
      this.adminControllerService
        .v1AdminMerchantsPost(addRequest)
        .subscribe((result: ApiResponseMerchant) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }
          setTimeout(() => {
            this.notifier.success(
              this.multiLanguageService.instant(
                'merchant.merchant_list.created'
              )
            );
            this._getMerchantList();
            this.allMerchant.push({
              ...result.result,
              title: result.result.name + ' (' + result.result.code + ')',
              value: result.result.id,
            });
            this.notificationService.hideLoading();
          }, 3000);
        })
    );
  }

  public refreshContent() {
    setTimeout(() => {
      this._getMerchantList();
    }, 2000);
  }

  private _bindingDialogData(data): CreateMerchantRequestDto {
    return {
      name: data?.name || null,
      address: data?.address || null,
      ward: data?.ward || null,
      district: data?.district || null,
      province: data?.province || null,
      bdStaffId: data?.bdStaffId || null,
      merchantSellType: data?.merchantSellType || null,
      merchantParentId: data?.merchantParentId || null,
      merchantManagerId: data?.merchantManagerId || null,
      mobile: data?.mobile || null,
      email: data?.email || null,
      website: data?.website || null,
      identificationNumber: data?.identificationNumber || null,
      establishTime: data?.establishTime
        ? this.formatTime(data?.establishTime)
        : null,
      productTypes: data?.productTypes || null,
      merchantServiceFee: data?.merchantServiceFee
        ? data?.merchantServiceFee / 100
        : 0.0,
      customerServiceFee: data?.customerServiceFee
        ? data?.customerServiceFee / 100
        : 0.0,
      status: data?.status ? data?.status : MerchantStatus.Active,
      logo: data?.logo || null,
      merchantFeatures: data?.merchantFeatures || null,
      description: data?.description || null,
      descriptionImg: data?.descriptionImg || null,
      createAgentInformationDto: {
        position: data?.managerPosition,
        mobile: data?.managerMobile,
        email: data?.managerEmail,
      },
    };
  }

  public updateElementInfo(updatedMerchantInfo) {
    if (!updatedMerchantInfo) {
      setTimeout(() => {
        // this.triggerDeselectUsers();
        this._getMerchantList();
      }, 2000);
    }
    this.dataSource.data.map((item) => {
      if (item.id === updatedMerchantInfo.id) {
        this.allColumns.forEach((column) => {
          item[column.key] = updatedMerchantInfo[column.key];
        });
      }
      return item;
    });
    // this.refreshContent();
  }

  private _getAllMerchant() {
    this.subManager.add(
      this.merchantListService
        .getAllMerchant()
        .subscribe(
          (response: ApiResponseSearchAndPaginationResponseMerchant) => {
            this.allMerchant = response?.result?.data.map((merchant) => {
              return {
                ...merchant,
                title: merchant.name + ' (' + merchant.code + ')',
                value: merchant.id,
              };
            });

            if (!this.allMerchant) return;

            let parentMerchant = this.allMerchant.filter((merchant) => {
              return (
                merchant.childMerchantIds &&
                merchant.childMerchantIds.length > 0
              );
            });

            this.filterOptions.forEach((filterOption: FilterOptionModel) => {
              if (filterOption.controlName !== 'merchantParentId') {
                return;
              }

              filterOption.options = parentMerchant;

              this.merchantParentList = parentMerchant;
            });

            this.filterOptions = JSON.parse(JSON.stringify(this.filterOptions));
          }
        )
    );
  }

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
  }
}
