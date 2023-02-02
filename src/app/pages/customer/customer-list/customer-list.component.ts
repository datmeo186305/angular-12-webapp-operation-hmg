import { Bank } from './../../../../../open-api-modules/dashboard-api-docs/model/bank';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PermissionConstants } from 'src/app/core/common/constants/permission-constants';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  FILTER_TYPE,
  NAV_ITEM,
  QUERY_CONDITION_TYPE,
} from '../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';
import { Observable, Subscription } from 'rxjs';
import {
  AdminAccountEntity,
  ApiResponseSearchAndPaginationResponseCompanyInfo,
  ApiResponseSearchAndPaginationResponseCustomerInfo,
  CompanyControllerService,
  CompanyInfo,
  CustomerInfo,
} from '../../../../../open-api-modules/dashboard-api-docs';
import { CustomerListService } from './customer-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromSelectors from '../../../core/store/selectors';
import { BreadcrumbOptionsModel } from '../../../public/models/external/breadcrumb-options.model';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { FilterOptionModel } from 'src/app/public/models/filter/filter-option.model';
import { FilterEventModel } from '../../../public/models/filter/filter-event.model';
import { FilterActionEventModel } from '../../../public/models/filter/filter-action-event.model';
import {
  ACCOUNT_CLASSIFICATION,
  CUSTOMER_STATUS,
} from '../../../core/common/enum/payday-loan';
import * as _ from 'lodash';
import { DisplayedFieldsModel } from '../../../public/models/filter/displayed-fields.model';
import { OverviewItemModel } from 'src/app/public/models/external/overview-item.model';
import { CommonState } from 'src/app/core/store/reducers/common.reducer';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, OnDestroy {
  companyList: Array<CompanyInfo>;
  subManager = new Subscription();
  public commonInfo$: Observable<any>;
  commonInfo: CommonState;
  bankOptions: Array<Bank>;

  tableTitle: string = this.multiLanguageService.instant(
    'page_title.customer_list'
  );
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.manage_customer'),
    iconClass: 'sprite-group-5-customer-green-medium',
    searchPlaceholder: this.multiLanguageService.instant(
      'breadcrumb.search_field.customer_list'
    ),
    searchable: true,
    showBtnAdd: false,
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
      title: this.multiLanguageService.instant('filter.company'),
      type: FILTER_TYPE.SELECT,
      controlName: 'companyId',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('filter.choose_company'),
          value: null,
          showAction: false,
          subTitle: this.multiLanguageService.instant('filter.choose_company'),
          subOptions: [],
          disabled: false,
          count: 0,
        },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.pl_ui_status'),
      type: FILTER_TYPE.SELECT,
      controlName: 'customerStatus',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: CUSTOMER_STATUS.ALL,
        },
        {
          title: this.multiLanguageService.instant(
            'customer.individual_info.customer_status.not_verified'
          ),
          value: CUSTOMER_STATUS.NOT_VERIFIED,
        },
        {
          title: this.multiLanguageService.instant(
            'customer.individual_info.customer_status.already_ekyc'
          ),
          value: CUSTOMER_STATUS.ALREADY_EKYC,
        },
        {
          title: this.multiLanguageService.instant(
            'customer.individual_info.customer_status.already_verified'
          ),
          value: CUSTOMER_STATUS.ALREADY_VERIFIED,
        },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.account_status'),
      type: FILTER_TYPE.SELECT,
      controlName: 'userStatus',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: null,
        },
        {
          title: this.multiLanguageService.instant('common.active'),
          value: AdminAccountEntity.UserStatusEnum.Active,
        },
        {
          title: this.multiLanguageService.instant('common.inactive'),
          value: AdminAccountEntity.UserStatusEnum.Locked,
        },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.account_classification'),
      type: FILTER_TYPE.SELECT,
      controlName: 'accountClassification',
      value: null,
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

  allColumns: DisplayedFieldsModel[] = [
    {
      key: 'id',
      title: this.multiLanguageService.instant('customer.individual_info.id'),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'firstName',
      title: this.multiLanguageService.instant(
        'customer.individual_info.fullname'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'mobileNumber',
      title: this.multiLanguageService.instant(
        'customer.individual_info.phone_number'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'emailAddress',
      title: this.multiLanguageService.instant(
        'customer.individual_info.email'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'dateOfBirth',
      title: this.multiLanguageService.instant(
        'customer.individual_info.date_of_birth'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'gender',
      title: this.multiLanguageService.instant(
        'customer.individual_info.gender'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'addressTwoLine1',
      title: this.multiLanguageService.instant(
        'customer.individual_info.permanent_address'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'addressOneLine1',
      title: this.multiLanguageService.instant(
        'customer.individual_info.current_residence'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'identityNumberOne',
      title: this.multiLanguageService.instant(
        'customer.individual_info.id_number'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'isVerified',
      externalKey: 'kalapaData',
      title: this.multiLanguageService.instant(
        'customer.individual_info.status'
      ),
      width: 100,
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.CUSTOMER_STATUS,
      showed: true,
    },
    {
      key: 'companyInfo.name',
      title: this.multiLanguageService.instant(
        'customer.individual_info.company'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'organizationName',
      title: this.multiLanguageService.instant(
        'customer.individual_info.employee_code'
      ),
      width: 100,
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'userStatus',
      title: this.multiLanguageService.instant(
        'customer.individual_info.active_status'
      ),
      width: 100,
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.USER_STATUS,
      showed: false,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'customer.individual_info.created_at'
      ),
      width: 100,
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: true,
    },
    {
      key: 'updatedAt',
      title: this.multiLanguageService.instant(
        'customer.individual_info.updated_at'
      ),
      width: 100,
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;
  filterForm: FormGroup;
  expandedElementId: string;
  expandElementFromLoan: any;
  expandedElementCustomer: CustomerInfo;
  overviewItems: OverviewItemModel[] = [
    {
      field: this.multiLanguageService.instant(
        'customer.total_customer_number'
      ),
      value: 0,
    },
  ];
  private readonly routeAllState$: Observable<Params>;

  listPermission = {
    getCustomerById:
      PermissionConstants.DASHBOARD_PERMISSION.GET_BY_ID_CUSTOMER,
  };

  constructor(
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private customerListService: CustomerListService,
    private companyControllerService: CompanyControllerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this.commonInfo$ = store.select(fromStore.getCommonInfoState);
    this.subManager.add(
      this.commonInfo$.subscribe((commonInfo) => {
        this.commonInfo = commonInfo?.commonInfo;
        this.bankOptions = this.commonInfo?.BankOptions;
        this.companyList = this.commonInfo?.CompanyOptions;
        this._initCompanyOptions();
      })
    );
    this._initFilterForm();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.CUSTOMER));
    this._initSubscription();
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      companyId: [''],
      id: [''],
      customerStatus: [ACCOUNT_CLASSIFICATION.ALL],
      userStatus: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      accountClassification: [ACCOUNT_CLASSIFICATION.REAL],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        companyId: QUERY_CONDITION_TYPE.IN,
        userStatus: QUERY_CONDITION_TYPE.EQUAL,
        id: QUERY_CONDITION_TYPE.EQUAL,
      },
    });
  }

  private _resetFilterForm() {
    this.filterForm.patchValue({
      keyword: '',
      companyId: '',
      id: '',
      customerStatus: CUSTOMER_STATUS.ALL,
      userStatus: '',
      orderBy: 'createdAt',
      sortDirection: 'desc',
      accountClassification: ACCOUNT_CLASSIFICATION.REAL,
      startTime: null,
      endTime: null,
      dateFilterType: '',
      dateFilterTitle: '',
      filterConditions: {
        companyId: QUERY_CONDITION_TYPE.IN,
        userStatus: QUERY_CONDITION_TYPE.EQUAL,
        id: QUERY_CONDITION_TYPE.EQUAL,
      },
    });
  }

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
      } else if (filterOption.controlName === 'companyId') {
        filterOption.value = this.filterForm.controls.companyId.value
          ? this.filterForm.controls.companyId.value.split(',')
          : [];
      } else if (filterOption.controlName === 'customerStatus') {
        filterOption.value = this.filterForm.controls.customerStatus.value
          ? this.filterForm.controls.customerStatus.value
          : null;
      } else if (filterOption.controlName === 'userStatus') {
        filterOption.value = this.filterForm.controls.userStatus.value
          ? this.filterForm.controls.userStatus.value
          : null;
      } else if (filterOption.controlName === 'accountClassification') {
        filterOption.value = this.filterForm.controls.accountClassification
          .value
          ? this.filterForm.controls.accountClassification.value
          : '';
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

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        if (params?.url.includes(window.location.pathname)) {
          this._parseQueryParams(params?.queryParams);
          this._getCustomerList();
        } else {
          this.dataSource.data = [];
        }
      })
    );
  }

  private _getCustomerList() {
    const params = this._buildParams();
    // this.subManager.add(
    this.customerListService
      .getData(params)
      .subscribe((data: ApiResponseSearchAndPaginationResponseCustomerInfo) => {
        this._parseData(data?.result);
        this.getOverviewData(data?.result);
        if (this.filterForm.controls.id?.value) {
          this.expandElementFromLoan = data?.result.data[0];
        }
      });
    // );
  }

  private _getCompanyList() {
    this.subManager.add(
      this.companyControllerService
        .getCompanies(100, 0, {})
        .subscribe(
          (response: ApiResponseSearchAndPaginationResponseCompanyInfo) => {
            this.companyList = response?.result?.data;
            this._initCompanyOptions();
          }
        )
    );
  }

  private _initCompanyOptions() {
    this.filterOptions.forEach((filterOption: FilterOptionModel) => {
      if (filterOption.controlName !== 'companyId' || !this.companyList) {
        return;
      }
      filterOption.options[0].subOptions = this.companyList.map(
        (company: CompanyInfo) => {
          return {
            title: company.name + ' (' + company.code + ')',
            value: company.id,
            imgSrc: company.avatar,
            code: company.code,
          };
        }
      );
    });
  }

  private _buildParams() {
    const data = this.filterForm.getRawValue();
    console.log('this.filterForm', data);
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

  getOverviewData(rawData) {
    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant('customer.total_customer_number')
    ).value = rawData?.pagination?.total;
  }

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
    this.expandedElementId = element.id;
    this.expandedElementCustomer = element;
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this.pageIndex = 0;
    this._onFilterChange();
  }

  public onFilterFormChange(event: FilterEventModel) {
    console.log('FilterEventModel', event);
    this.pageIndex = 0;
    this.filterForm.controls.id.setValue(null);

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
        if (event.controlName === 'companyId') {
          this.filterForm.controls.companyId.setValue(
            event.value ? event.value.join(',') : ''
          );
        } else if (event.controlName === 'customerStatus') {
          this.filterForm.controls.customerStatus.setValue(
            event.value ? event.value : CUSTOMER_STATUS.ALL
          );
        } else if (event.controlName === 'userStatus') {
          this.filterForm.controls.userStatus.setValue(
            event.value ? event.value : ''
          );
        } else if (event.controlName === 'accountClassification') {
          this.filterForm.controls.accountClassification.setValue(
            event.value ? event.value : ACCOUNT_CLASSIFICATION.REAL
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
  }

  public onRefreshTrigger(event) {
    this._getCustomerList();
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

    queryParams['accountClassification'] = data.accountClassification;
    queryParams['customerStatus'] = data.customerStatus;

    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
      })
      .then((r) => {});
  }

  public updateElementInfo(updatedCustomerInfo: CustomerInfo) {
    this.dataSource.data.map((item) => {
      if (item.id === updatedCustomerInfo.id) {
        this.allColumns.forEach((column) => {
          item[column.key] = updatedCustomerInfo[column.key];
        });
      }
      return item;
    });
  }

  ngOnDestroy(): void {
    if (this.subManager !== null) {
      this.subManager.unsubscribe();
    }
  }
}
