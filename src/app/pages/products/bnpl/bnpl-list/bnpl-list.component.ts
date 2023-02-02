import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { BnplApplication } from '../../../../../../open-api-modules/bnpl-api-docs';

import {
  ApiResponseSearchAndPaginationResponseBnplApplication,
  ApiResponseSearchAndPaginationResponseMerchant,
  Merchant,
  SearchAndPaginationResponseBnplApplication,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import { PermissionConstants } from '../../../../core/common/constants/permission-constants';
import {
  BNPL_STATUS,
  REPAYMENT_STATUS,
} from '../../../../core/common/enum/bnpl';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  FILTER_ACTION_TYPE,
  FILTER_TYPE,
  NAV_ITEM,
  QUERY_CONDITION_TYPE,
  RESPONSE_CODE,
} from '../../../../core/common/enum/operator';
import { ACCOUNT_CLASSIFICATION } from '../../../../core/common/enum/payday-loan';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import * as fromSelectors from '../../../../core/store/selectors';
import { BreadcrumbOptionsModel } from '../../../../public/models/external/breadcrumb-options.model';
import { OverviewItemModel } from '../../../../public/models/external/overview-item.model';
import { DisplayedFieldsModel } from '../../../../public/models/filter/displayed-fields.model';
import { FilterActionEventModel } from '../../../../public/models/filter/filter-action-event.model';
import { FilterEventModel } from '../../../../public/models/filter/filter-event.model';
import { FilterItemModel } from '../../../../public/models/filter/filter-item.model';
import { FilterOptionModel } from '../../../../public/models/filter/filter-option.model';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { CustomerListService } from '../../../customer/customer-list/customer-list.service';
import { MerchantListService } from '../../../system/merchant/merchant-list/merchant-list.service';
import { BnplListService } from './bnpl-list.service';

@Component({
  selector: 'app-bnpl-list',
  templateUrl: './bnpl-list.component.html',
  styleUrls: ['./bnpl-list.component.scss'],
})
export class BnplListComponent implements OnInit, OnDestroy {
  subManager = new Subscription();
  tableTitle: string = this.multiLanguageService.instant(
    'page_title.bnpl_list'
  );
  groupName: string = '';
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.manage_bnpl'),
    iconImgSrc: 'assets/img/icon/group-5/svg/pl-24-available.png',
    searchPlaceholder: this.multiLanguageService.instant(
      'breadcrumb.search_field.bnpl'
    ),
    searchable: true,
    showBtnExport: false,
    btnExportText: this.multiLanguageService.instant('common.export_excel'),
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
      title: this.multiLanguageService.instant('filter.merchant_name'),
      type: FILTER_TYPE.SEARCH_SELECT,
      controlName: 'merchant.id',
      value: null,
      showAction: true,
      titleAction: this.multiLanguageService.instant('common.reset'),
      actionControlName: 'RESET_FILTER_MERCHANT',
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
      title: this.multiLanguageService.instant('filter.bnpl_status'),
      type: FILTER_TYPE.SELECT,
      controlName: 'status',
      value: null,
      multiple: false,
      showAction: true,
      titleAction: this.multiLanguageService.instant('common.reset'),
      actionControlName: 'RESET_FILTER_STATUS',
      options: [
        // {
        //   title: this.multiLanguageService.instant('common.all'),
        //   value: null,
        // },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.account_classification'),
      type: FILTER_TYPE.SELECT,
      controlName: 'accountClassification',
      value: null,
      hidden: false,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: ACCOUNT_CLASSIFICATION.ALL,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.account_classification_real'
          ),
          value: ACCOUNT_CLASSIFICATION.REAL,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.account_classification_test'
          ),
          value: ACCOUNT_CLASSIFICATION.TEST,
        },
      ],
    },
  ];

  statusFilterOptions: FilterItemModel[] = [
    // {
    //   title: this.multiLanguageService.instant('common.all'),
    //   value: null,
    // },
    {
      title: this.multiLanguageService.instant('bnpl.status.pending'),
      value: BNPL_STATUS.PENDING,
    },
    {
      title: this.multiLanguageService.instant('bnpl.status.undoapproval'),
      value: BNPL_STATUS.UNDOAPPROVAL,
    },
    {
      title: this.multiLanguageService.instant('bnpl.status.approve'),
      value: BNPL_STATUS.APPROVE,
    },
    {
      title: this.multiLanguageService.instant('bnpl.status.contract_awaiting'),
      value: BNPL_STATUS.CONTRACT_AWAITING,
    },
    {
      title: this.multiLanguageService.instant('bnpl.status.contract_accepted'),
      value: BNPL_STATUS.CONTRACT_ACCEPTED,
    },
    // {
    //   title: this.multiLanguageService.instant('bnpl.status.disburse'),
    //   value: BNPL_STATUS.DISBURSE,
    // },
    {
      title: this.multiLanguageService.instant(
        'bnpl.repayment_status.payment_term_1'
      ),
      value: REPAYMENT_STATUS.PAYMENT_TERM_1,
    },
    {
      title: this.multiLanguageService.instant(
        'bnpl.repayment_status.payment_term_2'
      ),
      value: REPAYMENT_STATUS.PAYMENT_TERM_2,
    },
    {
      title: this.multiLanguageService.instant(
        'bnpl.repayment_status.payment_term_3'
      ),
      value: REPAYMENT_STATUS.PAYMENT_TERM_3,
    },
    {
      title: this.multiLanguageService.instant('bnpl.repayment_status.overdue'),
      value: REPAYMENT_STATUS.OVERDUE,
    },
    {
      title: this.multiLanguageService.instant(
        'bnpl.repayment_status.bad_debt'
      ),
      value: REPAYMENT_STATUS.BADDEBT,
    },
    {
      title: this.multiLanguageService.instant('bnpl.status.completed'),
      value: BNPL_STATUS.COMPLETED,
    },
    {
      title: this.multiLanguageService.instant('bnpl.status.withdraw'),
      value: BNPL_STATUS.WITHDRAW,
    },
  ];

  allColumns: DisplayedFieldsModel[] = [
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant('bnpl.loan_info.created_at'),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'HH:mm:ss dd/MM/yyyy',
      showed: true,
    },
    {
      key: 'loanCode',
      title: this.multiLanguageService.instant('bnpl.loan_info.loan_code'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'customerInfo.firstName',
      title: this.multiLanguageService.instant('bnpl.loan_info.customer_name'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'merchant.name',
      title: this.multiLanguageService.instant('bnpl.loan_info.merchant'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'customerInfo.emailAddress',
      title: this.multiLanguageService.instant('bnpl.loan_info.email'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'loanAmount',
      title: this.multiLanguageService.instant('bnpl.loan_info.origin_amount'),
      type: DATA_CELL_TYPE.CURRENCY,
      format: null,
      showed: true,
    },
    {
      key: 'discount',
      title: this.multiLanguageService.instant('bnpl.loan_info.discount'),
      type: DATA_CELL_TYPE.CURRENCY,
      format: null,
      showed: true,
    },
    {
      key: 'totalAmount',
      title: this.multiLanguageService.instant('bnpl.loan_info.total_amount'),
      type: DATA_CELL_TYPE.CURRENCY,
      format: null,
      showed: true,
    },
    {
      key: 'status',
      externalKey: 'periodTimes',
      title: this.multiLanguageService.instant('bnpl.loan_info.status'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.BNPL_STATUS,
      showed: true,
    },
    {
      key: 'updatedAt',
      title: this.multiLanguageService.instant('bnpl.loan_info.updated_at'),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  expandedElementLoanId: string;
  expandedElementLoanDetail: any;
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;
  filterForm: FormGroup;
  merchantList: Merchant[];
  private readonly routeAllState$: Observable<Params>;

  overviewItems: OverviewItemModel[] = [
    {
      field: this.multiLanguageService.instant(
        'bnpl.loan_info.total_loan_number'
      ),
      value: 0,
    },
    // {
    //   field: this.multiLanguageService.instant(
    //     'bnpl.loan_info.total_loan_amount_number'
    //   ),
    //   value: 0,
    // },
    // {
    //   field: this.multiLanguageService.instant(
    //     'bnpl.loan_info.total_late_penalty_number'
    //   ),
    //   value: 0,
    // },
  ];

  listPermission = {
    getListBnpl: PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_BNPL,
    getByIdBnpl: PermissionConstants.DASHBOARD_PERMISSION.GET_BY_ID_BNPL,
  };

  userHasPermissions = {
    filterViews: {
      getbnplByUserStatus: false,
      getListMerchant: false,
    },
    bnplViewStatus: {
      pending: false,
      undoapproval: false,
      approve: false,
      reject: false,
      disburse: false,
      contract_accepted: false,
      contract_awaiting: false,
      withdraw: false,
      completed: false,
    },
  };

  constructor(
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private customerListService: CustomerListService,
    private merchantListService: MerchantListService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bnplListService: BnplListService,
    private notifier: ToastrService,
    private permissionsService: NgxPermissionsService
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.BNPL));
    this._initSubscription();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._onFilterChange();
  }

  onSortChange(sortState: Sort) {
    this.filterForm.controls.orderBy.setValue(sortState.active);
    this.filterForm.controls.sortDirection.setValue(sortState.direction);
    this._onFilterChange();
  }

  public onExpandElementChange(element: any) {
    this.expandedElementLoanDetail = element;
    this.expandedElementLoanId = element.id;
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this.pageIndex = 0;
    this._onFilterChange();
  }

  public onRefreshTrigger(event) {
    this._getLoanList();
  }

  public updateElementInfo(updatedLoan: BnplApplication) {
    console.log('updatedLoan', updatedLoan);
    this.dataSource.data.map((item) => {
      if (item.id === updatedLoan.id) {
        this.allColumns.forEach((column) => {
          item[column.key] = updatedLoan[column.key];
        });
      }
      return item;
    });
  }

  public onFilterFormChange(event: FilterEventModel) {
    this.pageIndex = 0;
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
          this.filterForm.controls.status.setValue(
            event.value ? event.value : ''
          );
        } else if (event.controlName === 'accountClassification') {
          this.filterForm.controls.accountClassification.setValue(
            event.value ? event.value : ACCOUNT_CLASSIFICATION.REAL
          );
        }
        break;
      case FILTER_TYPE.SEARCH_SELECT:
        if (event.controlName === 'merchant.id') {
          const pacMerchantIds = this.getAllMerchantIds(
            event.value,
            this.merchantList
          );
          this.filterForm.controls['merchant.id'].setValue(
            pacMerchantIds ? pacMerchantIds.join(',') : ''
          );
        }
        break;
      default:
        break;
    }

    this._onFilterChange();
  }

  private getAllMerchantIds(arrayMerchantIdSelected, merchantList) {
    const arrayMerchantIds = [];
    function loop(paramIds) {
      for (const id of paramIds) {
        const merchant = merchantList.find((merchant) => merchant.id === id);
        if (merchant?.id) {
          arrayMerchantIds.push(merchant.id);
        } else {
          arrayMerchantIds.push(id);
        }
        if (merchant?.childMerchantIds) {
          loop(merchant.childMerchantIds);
        }
      }
    }
    loop(arrayMerchantIdSelected);
    return arrayMerchantIds;
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {
    console.log('FilterActionEventModel', event);
    if (event.type === FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION) {
      if (event.controlName === 'merchant.id') {
        this.handleFilterActionTriggerMerchantId(event);
      } else if (event.controlName === 'status') {
        this.handleFilterActionTriggerStatus(event);
      }
    }
  }

  private handleFilterActionTriggerMerchantId(event: FilterActionEventModel) {
    if (event.actionControlName === 'RESET_FILTER_MERCHANT') {
      this.onFilterFormChange({
        type: FILTER_TYPE.SEARCH_SELECT,
        controlName: 'merchant.id',
        value: null,
      });
      this._resetFilterOptions();
    }
  }

  private handleFilterActionTriggerStatus(event: FilterActionEventModel) {
    if (event.actionControlName === 'RESET_FILTER_STATUS') {
      this.onFilterFormChange({
        type: FILTER_TYPE.SELECT,
        controlName: 'status',
        value: null,
      });
      this._resetFilterOptions();
    }
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      status: [''],
      'merchant.id': [''],
      updatedAt: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [''],
      endTime: [''],
      dateFilterType: [''],
      dateFilterTitle: [''],
      accountClassification: [ACCOUNT_CLASSIFICATION.REAL],
      filterConditions: {
        status: QUERY_CONDITION_TYPE.IN,
        'merchant.id': QUERY_CONDITION_TYPE.IN,
      },
    });
  }

  private _parseQueryParams(params) {
    this._initFilterFormFromQueryParams(params);
    this._initFilterOptionsFromQueryParams(params);

    this.breadcrumbOptions.keyword = params.keyword;
    this.pageIndex = params.pageIndex || 0;
    this.pageSize = params.pageSize || 10;
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
      } else if (filterOption.controlName === 'status') {
        filterOption.value = this.filterForm.controls.status.value
          ? this.filterForm.controls.status.value.split(',')
          : [];
      } else if (filterOption.controlName === 'merchant.id') {
        filterOption.value = this.filterForm.controls['merchant.id'].value
          ? this.filterForm.controls['merchant.id'].value.split(',')
          : [];
      } else if (filterOption.controlName === 'accountClassification') {
        filterOption.value = this.filterForm.controls.accountClassification
          .value
          ? this.filterForm.controls.accountClassification.value
          : '';
      }
    });
  }

  private _resetFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      status: [''],
      'merchant.id': [''],
      updatedAt: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [''],
      endTime: [''],
      dateFilterType: [''],
      dateFilterTitle: [''],
      accountClassification: [ACCOUNT_CLASSIFICATION.REAL],
      filterConditions: {
        status: QUERY_CONDITION_TYPE.IN,
        'merchant.id': QUERY_CONDITION_TYPE.IN,
      },
    });
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        if (params?.url.includes(window.location.pathname)) {
          this._parseQueryParams(params?.queryParams);
          this._getLoanList();
        } else {
          this.dataSource.data = [];
        }
      })
    );

    this.subManager.add(
      this.permissionsService.permissions$.subscribe((permissions) => {
        if (permissions) {
          this._checkUserPermissions();
        }
      })
    );
  }

  private _resetFilterOptions() {
    let newFilterOptions = JSON.parse(JSON.stringify(this.filterOptions));
    newFilterOptions.forEach((filterOption) => {
      filterOption.value = null;
    });
    this.filterOptions = newFilterOptions;
  }

  private _getLoanList() {
    let params = this._buildParams();
    this.bnplListService
      .getData(params)
      .subscribe(
        (data: ApiResponseSearchAndPaginationResponseBnplApplication) => {
          if (!data || data.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(data?.message),
              data?.errorCode
            );
          }
          this._parseData(data?.result);
          this.dataSource.data = data?.result?.data.map((item) => {
            return {
              ...item,
              totalAmount: item.loanAmount,
              periodTimes: item.periods
                ? {
                    periodTime1: item.periodTime1,
                    periodTime2: item.periodTime2,
                    periodTime3: item.periodTime3,
                    periodTime4: item.periodTime4,
                  }
                : null,
            };
          });
          this.getOverviewData(data?.result);
        }
      );
  }

  private _buildParams() {
    const data = this.filterForm.getRawValue();
    data.offset = this.pageIndex * this.pageSize;
    data.pageSize = this.pageSize;
    data.pageNumber = this.pageIndex;
    return data;
  }

  private _parseData(rawData: SearchAndPaginationResponseBnplApplication) {
    this.pageLength = rawData?.pagination?.maxPage || 0;
    this.totalItems = rawData?.pagination?.total || 0;
    this.dataSource.data = rawData?.data || [];
  }

  getOverviewData(rawData: SearchAndPaginationResponseBnplApplication) {
    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant('bnpl.loan_info.total_loan_number')
    ).value = rawData?.pagination?.total;

    // this.overviewItems.find(
    //   (ele) =>
    //     ele.field ===
    //     this.multiLanguageService.instant(
    //       'bnpl.loan_info.total_loan_amount_number'
    //     )
    // ).value = rawData?.meta?.totalAmounts;
    //
    // this.overviewItems.find(
    //   (ele) =>
    //     ele.field ===
    //     this.multiLanguageService.instant(
    //       'bnpl.loan_info.total_late_penalty_number'
    //     )
    // ).value = rawData?.meta?.totalLatePenaltyPayment;
  }

  private _onFilterChange() {
    const data = this.filterForm.getRawValue();
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

    queryParams['groupName'] = data.groupName;
    queryParams['orderBy'] = data.orderBy;
    queryParams['sortDirection'] = data.sortDirection;
    queryParams['pageIndex'] = this.pageIndex;
    queryParams['pageSize'] = this.pageSize;
    queryParams['keyword'] = data.keyword;

    queryParams['accountClassification'] = data.accountClassification;

    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
      })
      .then((r) => {});
  }

  onClickBtnExport(event) {}

  // public downloadExcelFile(data) {
  //   const convertData = this.bnplListService.convertBlobType(
  //     data,
  //     'application/xlxs'
  //   );
  //   const a = document.createElement('a');
  //   a.setAttribute('target', '_blank');
  //   a.setAttribute('href', convertData);
  //   a.setAttribute('rel', 'noopener');
  //   const startTime = this.filterForm.getRawValue().startTime
  //     ? '-' + moment(this.filterForm.getRawValue().startTime).format('DDMMYYYY')
  //     : '';
  //   const endTime = this.filterForm.getRawValue().endTime
  //     ? '-' + moment(this.filterForm.getRawValue().endTime).format('DDMMYYYY')
  //     : '';
  //   const convertFile =
  //     'DanhSachKhoanUng-' + this.groupName + startTime + endTime + '.xlsx';
  //   a.setAttribute('download', convertFile);
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   this.notifier.info(
  //     this.multiLanguageService.instant('bnpl.loan_contract.downloading')
  //   );
  // }

  private async _checkUserPermissions() {
    await this._checkPermission();
    if (this.userHasPermissions.filterViews.getListMerchant) {
      this._getMerchantList();
    }
    this._displayStatusFilterOptions();
    this.changeHiddenFilterOptionByPermission();
  }

  private async _checkPermission() {
    this.userHasPermissions.bnplViewStatus.pending =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_BNPL_STATUS_PERMISSION.PENDING
      );
    this.userHasPermissions.bnplViewStatus.undoapproval =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_BNPL_STATUS_PERMISSION.UNDOAPPROVAL
      );
    this.userHasPermissions.bnplViewStatus.approve =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_BNPL_STATUS_PERMISSION.APPROVE
      );
    this.userHasPermissions.bnplViewStatus.reject =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_BNPL_STATUS_PERMISSION.REJECT
      );
    this.userHasPermissions.bnplViewStatus.disburse =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_BNPL_STATUS_PERMISSION.DISBURSE
      );
    this.userHasPermissions.bnplViewStatus.contract_accepted =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_BNPL_STATUS_PERMISSION.CONTRACT_ACCEPTED
      );
    this.userHasPermissions.bnplViewStatus.contract_awaiting =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_BNPL_STATUS_PERMISSION.CONTRACT_AWAITING
      );
    this.userHasPermissions.bnplViewStatus.withdraw =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_BNPL_STATUS_PERMISSION.WITHDRAW
      );
    this.userHasPermissions.bnplViewStatus.completed =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_BNPL_STATUS_PERMISSION.COMPLETED
      );
    this.userHasPermissions.filterViews.getbnplByUserStatus =
      await this.permissionsService.hasPermission(
        PermissionConstants.OPERATOR_PERMISSION.GET_BNPL_USER_STATUS
      );
    this.userHasPermissions.filterViews.getListMerchant =
      await this.permissionsService.hasPermission(
        PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_MERCHANT
      );
  }

  private _displayStatusFilterOptions() {
    this.statusFilterOptions.forEach((option) => {
      switch (option.value) {
        case BNPL_STATUS.PENDING:
          option.hidden = !this.userHasPermissions.bnplViewStatus.pending;
          break;
        case BNPL_STATUS.UNDOAPPROVAL:
          option.hidden = !this.userHasPermissions.bnplViewStatus.undoapproval;
          break;
        case BNPL_STATUS.APPROVE:
          option.hidden = !this.userHasPermissions.bnplViewStatus.approve;
          break;
        case BNPL_STATUS.DISBURSE:
          option.hidden = !this.userHasPermissions.bnplViewStatus.disburse;
          break;
        case BNPL_STATUS.CONTRACT_ACCEPTED:
          option.hidden =
            !this.userHasPermissions.bnplViewStatus.contract_accepted;
          break;
        case BNPL_STATUS.CONTRACT_AWAITING:
          option.hidden =
            !this.userHasPermissions.bnplViewStatus.contract_awaiting;
          break;
        case BNPL_STATUS.WITHDRAW:
          option.hidden = !this.userHasPermissions.bnplViewStatus.withdraw;
          break;
        case BNPL_STATUS.COMPLETED:
          option.hidden = !this.userHasPermissions.bnplViewStatus.completed;
          break;
        default:
          break;
      }
    });
    this.filterOptions.forEach((value) => {
      if (value.controlName === 'status') {
        value.options = this.statusFilterOptions;
      }
    });
  }

  private changeHiddenFilterOptionByPermission() {
    this.filterOptions.forEach((option) => {
      if (option.controlName === 'accountClassification') {
        option.hidden =
          !this.userHasPermissions.filterViews.getbnplByUserStatus;
      }
      if (option.controlName === 'merchant.id') {
        option.hidden = !this.userHasPermissions.filterViews.getListMerchant;
      }
    });
  }

  private _getMerchantList() {
    this.merchantListService
      .getAllMerchant()
      .subscribe((response: ApiResponseSearchAndPaginationResponseMerchant) => {
        if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
          return this.notifier.error(
            JSON.stringify(response?.message),
            response?.errorCode
          );
        }
        let merchantOptions = response?.result?.data.map((merchant) => {
          return {
            ...merchant,
            title: merchant.name + ' (' + merchant.code + ')',
            value: merchant.id,
          };
        });

        this.filterOptions.forEach((filterOption: FilterOptionModel) => {
          if (filterOption.controlName !== 'merchant.id') {
            return;
          }

          filterOption.options = merchantOptions;

          this.merchantList = merchantOptions;

          filterOption.hidden = this.merchantList.length < 2 ? true : false;
        });

        this.filterOptions = JSON.parse(JSON.stringify(this.filterOptions));
      });
  }

  ngOnDestroy(): void {
    if (this.subManager !== null) {
      this.subManager.unsubscribe();
    }
  }
}
