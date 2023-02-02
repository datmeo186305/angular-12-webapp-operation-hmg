import { CommonState } from 'src/app/core/store/reducers/common.reducer';
import { Bank } from './../../../../../../open-api-modules/dashboard-api-docs/model/bank';
import { BankControllerService } from './../../../../../../open-api-modules/dashboard-api-docs/api/bankController.service';
import { PaydayLoanTng } from './../../../../../../open-api-modules/dashboard-api-docs/model/paydayLoanTng';
import { ToastrService } from 'ngx-toastr';
import {
  ACCOUNT_CLASSIFICATION,
  APPLICATION_TYPE,
  COMPANY_NAME,
  DEBT_STATUS,
  PAYDAY_LOAN_STATUS,
  REPAYMENT_STATUS,
  TERM_TYPE,
} from '../../../../core/common/enum/payday-loan';
import {
  ApiResponseSearchAndPaginationResponsePaydayLoanHmg,
  ApiResponseSearchAndPaginationResponsePaydayLoanTng,
  CompanyControllerService,
  PaydayLoanHmg,
  SearchAndPaginationResponsePaydayLoanHmg,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import { FilterActionEventModel } from '../../../../public/models/filter/filter-action-event.model';
import { FilterEventModel } from '../../../../public/models/filter/filter-event.model';
import { CompanyInfo } from '../../../../../../open-api-modules/customer-api-docs';
import { FILTER_TYPE } from 'src/app/core/common/enum/operator';
import { LoanListService } from './loan-list.service';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { CustomerListService } from '../../../customer/customer-list/customer-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbOptionsModel } from '../../../../public/models/external/breadcrumb-options.model';
import { Observable, Subscription } from 'rxjs';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
  NAV_ITEM,
  QUERY_CONDITION_TYPE,
} from '../../../../core/common/enum/operator';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import * as fromSelectors from '../../../../core/store/selectors';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterOptionModel } from 'src/app/public/models/filter/filter-option.model';
import { DisplayedFieldsModel } from '../../../../public/models/filter/displayed-fields.model';
import * as moment from 'moment';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionConstants } from '../../../../core/common/constants/permission-constants';
import { FilterItemModel } from '../../../../public/models/filter/filter-item.model';
import { OverviewItemModel } from 'src/app/public/models/external/overview-item.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss'],
})
export class LoanListComponent implements OnInit, OnDestroy {
  companyList: Array<CompanyInfo>;
  bankList: Array<Bank>;
  public commonInfo$: Observable<any>;
  commonInfo: CommonState;
  subManager = new Subscription();
  tableTitle: string = this.multiLanguageService.instant(
    'page_title.loan_list'
  );
  groupName: string = '';
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title:
      this.multiLanguageService.instant('breadcrumb.manage_payday_loan') +
      ' - ' +
      this.groupName,
    iconImgSrc: 'assets/img/icon/group-5/svg/pl-24-available.png',
    searchPlaceholder: this.multiLanguageService.instant(
      'breadcrumb.search_field.payday_loan'
    ),
    searchable: true,
    showBtnExport: true,
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
      title: this.multiLanguageService.instant('filter.loan_status'),
      type: FILTER_TYPE.SELECT,
      controlName: 'status',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: null,
        },
      ],
    },
    {
      title: this.multiLanguageService.instant('filter.term_type'),
      type: FILTER_TYPE.SELECT,
      controlName: 'termType',
      value: null,
      options: [
        {
          title: this.multiLanguageService.instant('common.all'),
          value: null,
        },
        {
          title: this.multiLanguageService.instant(
            'payday_loan.term_type.one_month'
          ),
          value: TERM_TYPE.ONE_MONTH,
        },
        {
          title: this.multiLanguageService.instant(
            'payday_loan.term_type.three_month'
          ),
          value: TERM_TYPE.THREE_MONTH,
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

  statusFilterOptionsTng: FilterItemModel[] = [
    {
      title: this.multiLanguageService.instant('common.all'),
      value: null,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.initialized'
      ),
      value: PAYDAY_LOAN_STATUS.INITIALIZED,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.document_awaiting'
      ),
      value: PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.status.documentation_complete'
      ),
      value: PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.auction'),
      value: PAYDAY_LOAN_STATUS.AUCTION,
    },
    {
      title: this.multiLanguageService.instant('payday_loan.status.funded'),
      value: PAYDAY_LOAN_STATUS.FUNDED,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.disbursement_awaiting'
      ),
      value: PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.disbursed'),
      value: PAYDAY_LOAN_STATUS.DISBURSED,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.ỉn_repayment'
      ),
      value: PAYDAY_LOAN_STATUS.IN_REPAYMENT,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.repayment_status.overdue'
      ),
      value: REPAYMENT_STATUS.OVERDUE,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.repayment_status.bad_debt'
      ),
      value: DEBT_STATUS.BADDEBT,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.completed'),
      value: PAYDAY_LOAN_STATUS.COMPLETED,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.rejected'),
      value: PAYDAY_LOAN_STATUS.REJECTED,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.withdrew'),
      value: PAYDAY_LOAN_STATUS.WITHDRAW,
    },
  ];

  statusFilterOptionsHmg: FilterItemModel[] = [
    {
      title: this.multiLanguageService.instant('common.all'),
      value: null,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.initialized'
      ),
      value: PAYDAY_LOAN_STATUS.INITIALIZED,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.status.documentation_complete'
      ),
      value: PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.auction'),
      value: PAYDAY_LOAN_STATUS.AUCTION,
    },
    {
      title: this.multiLanguageService.instant('payday_loan.status.funded'),
      value: PAYDAY_LOAN_STATUS.FUNDED,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.status.contract_awaiting'
      ),
      value: PAYDAY_LOAN_STATUS.CONTRACT_AWAITING,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.disbursement_awaiting'
      ),
      value: PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.disbursed'),
      value: PAYDAY_LOAN_STATUS.DISBURSED,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.ỉn_repayment'
      ),
      value: PAYDAY_LOAN_STATUS.IN_REPAYMENT,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.repayment_status.overdue'
      ),
      value: REPAYMENT_STATUS.OVERDUE,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.repayment_status.bad_debt'
      ),
      value: DEBT_STATUS.BADDEBT,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.completed'),
      value: PAYDAY_LOAN_STATUS.COMPLETED,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.rejected'),
      value: PAYDAY_LOAN_STATUS.REJECTED,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.withdrew'),
      value: PAYDAY_LOAN_STATUS.WITHDRAW,
    },
  ];

  statusFilterOptionsVac: FilterItemModel[] = [
    {
      title: this.multiLanguageService.instant('common.all'),
      value: null,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.initialized'
      ),
      value: PAYDAY_LOAN_STATUS.INITIALIZED,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.document_awaiting_vac'
      ),
      value: PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.status.documentation_complete'
      ),
      value: PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.auction'),
      value: PAYDAY_LOAN_STATUS.AUCTION,
    },
    {
      title: this.multiLanguageService.instant('payday_loan.status.funded'),
      value: PAYDAY_LOAN_STATUS.FUNDED,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.status.contract_awaiting'
      ),
      value: PAYDAY_LOAN_STATUS.CONTRACT_AWAITING,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.disbursement_awaiting'
      ),
      value: PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.disbursed'),
      value: PAYDAY_LOAN_STATUS.DISBURSED,
    },
    {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.ỉn_repayment'
      ),
      value: PAYDAY_LOAN_STATUS.IN_REPAYMENT,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.repayment_status.overdue'
      ),
      value: REPAYMENT_STATUS.OVERDUE,
    },
    {
      title: this.multiLanguageService.instant(
        'payday_loan.repayment_status.bad_debt'
      ),
      value: DEBT_STATUS.BADDEBT,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.completed'),
      value: PAYDAY_LOAN_STATUS.COMPLETED,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.rejected'),
      value: PAYDAY_LOAN_STATUS.REJECTED,
    },
    {
      title: this.multiLanguageService.instant('loan_app.loan_info.withdrew'),
      value: PAYDAY_LOAN_STATUS.WITHDRAW,
    },
  ];

  allColumns: DisplayedFieldsModel[] = [
    {
      key: 'loanCode',
      title: this.multiLanguageService.instant('loan_app.loan_info.loan_code'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'status',
      externalKey: 'repaymentStatus',
      externalKey2: 'defaultStatus',
      title: this.multiLanguageService.instant('loan_app.loan_info.status'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_HMG_STATUS,
      showed: true,
    },
    {
      key: 'customerInfo.firstName',
      title: this.multiLanguageService.instant('loan_app.loan_info.customer'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'customerInfo.mobileNumber',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.phone_number'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'expectedTenure',
      title: this.multiLanguageService.instant('loan_app.loan_info.loan_term'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.register_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: true,
    },
    {
      key: 'updatedAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.updated_at_short'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
    {
      key: 'approvedAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.approved_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
    {
      key: 'disbursedAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.disbursed_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
    {
      key: 'completedAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.completed_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
    {
      key: 'customerInfo.emailAddress',
      title: this.multiLanguageService.instant(
        'customer.individual_info.email'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'customerInfo.identityNumberOne',
      title: this.multiLanguageService.instant('customer.individual_info.cmnd'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
    {
      key: 'termType',
      title: this.multiLanguageService.instant('loan_app.loan_info.term_type'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_TERM_TYPE,
      showed: false,
    },
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  expandedElementLoanId: string;
  expandedElementLoanDetail: PaydayLoanTng | PaydayLoanHmg;
  expandedElementCustomerId: string;
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;
  filterForm: FormGroup;
  private readonly routeAllState$: Observable<Params>;

  overviewItems: OverviewItemModel[] = [
    {
      field: this.multiLanguageService.instant(
        'loan_app.loan_info.total_loan_number'
      ),
      value: 0,
    },
    {
      field: this.multiLanguageService.instant(
        'loan_app.loan_info.total_loan_amount_number'
      ),
      value: 0,
    },
    {
      field: this.multiLanguageService.instant(
        'loan_app.loan_info.total_late_penalty_number'
      ),
      value: 0,
    },
  ];

  listPermission = {
    getListTNG: PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_TNG,
    getListVAC: PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_VAC,
    getByIdHMG: PermissionConstants.DASHBOARD_PERMISSION.GET_BY_ID_HMG,
  };

  userHasPermissions = {
    loanTngViewStatus: {
      initialized: false,
      auction: false,
      document_awaiting: false,
      documentation_complete: false,
      funded: false,
      contract_accepted: false,
      awaiting_disbursement: false,
      disbursed: false,
      in_repayment: false,
      completed: false,
      rejected: false,
      withdraw: false,
      contract_rejected: false,
    },
    loanVacViewStatus: {
      initialized: false,
      auction: false,
      document_awaiting: false,
      documentation_complete: false,
      funded: false,
      contract_accepted: false,
      awaiting_disbursement: false,
      disbursed: false,
      in_repayment: false,
      completed: false,
      rejected: false,
      withdraw: false,
      contract_rejected: false,
    },
  };

  constructor(
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService,
    private customerListService: CustomerListService,
    private companyControllerService: CompanyControllerService,
    private bankControllerService: BankControllerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loanListService: LoanListService,
    private notifier: ToastrService,
    private permissionsService: NgxPermissionsService
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this.commonInfo$ = store.select(fromStore.getCommonInfoState);
    this.subManager.add(
      this.commonInfo$.subscribe((commonInfo) => {
        this.commonInfo = commonInfo?.commonInfo;
        this.bankList = this.commonInfo?.BankOptions;
        this.companyList = this.commonInfo?.CompanyOptions;
      })
    );
    this._initFilterForm();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.LOANAPP));
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
    this.expandedElementCustomerId = element.customerId;
  }

  public onSubmitSearchForm(event) {
    this.filterForm.controls.keyword.setValue(event.keyword);
    this.pageIndex = 0;
    this._onFilterChange();
  }

  public onRefreshTrigger(event) {
    this._getLoanList();
  }

  public updateElementInfo(updatedLoan: PaydayLoanHmg) {
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
        if (event.controlName === 'companyId') {
          this.filterForm.controls.companyId.setValue(
            event.value ? event.value.join(',') : ''
          );
        } else if (event.controlName === 'status') {
          this.filterForm.controls.status.setValue(
            event.value ? event.value : ''
          );
        } else if (event.controlName === 'termType') {
          this.filterForm.controls.termType.setValue(
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

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      companyId: [''],
      groupName: [''],
      loanCode: [''],
      status: [''],
      termType: [''],
      updatedAt: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [''],
      endTime: [''],
      dateFilterType: [''],
      dateFilterTitle: [''],
      accountClassification: [ACCOUNT_CLASSIFICATION.REAL],
      filterConditions: {
        companyId: QUERY_CONDITION_TYPE.IN,
        status: QUERY_CONDITION_TYPE.IN,
        termType: QUERY_CONDITION_TYPE.IN,
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
      } else if (filterOption.controlName === 'companyId') {
        filterOption.value = this.filterForm.controls.companyId.value
          ? this.filterForm.controls.companyId.value.split(',')
          : [];
      } else if (filterOption.controlName === 'status') {
        filterOption.value = this.filterForm.controls.status.value
          ? this.filterForm.controls.status.value.split(',')
          : [];
      } else if (filterOption.controlName === 'termType') {
        filterOption.value = this.filterForm.controls.termType.value
          ? this.filterForm.controls.termType.value.split(',')
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
      companyId: [''],
      groupName: [''],
      loanCode: [''],
      status: [''],
      termType: [''],
      updatedAt: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [''],
      endTime: [''],
      dateFilterType: [''],
      dateFilterTitle: [''],
      accountClassification: [ACCOUNT_CLASSIFICATION.REAL],
      filterConditions: {
        companyId: QUERY_CONDITION_TYPE.IN,
        status: QUERY_CONDITION_TYPE.IN,
        termType: QUERY_CONDITION_TYPE.IN,
      },
    });
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        if (
          this.groupName !== params?.queryParams.groupName &&
          params?.queryParams
        ) {
          this.changeCompanyGroupName(params?.queryParams.groupName);
        }
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

  private changeCompanyGroupName(groupName) {
    this.groupName = groupName;
    this._resetFilterOptions();
    this._initFilterForm();
    this.filterForm.controls['groupName'].setValue(this.groupName);
    const params = this._buildParams();
    this._initCompanyOptions(this.groupName);

    let newDataStatusType = DATA_STATUS_TYPE.PL_TNG_STATUS;
    switch (this.groupName) {
      case COMPANY_NAME.HMG:
        newDataStatusType = DATA_STATUS_TYPE.PL_HMG_STATUS;
        break;
      case COMPANY_NAME.VAC:
        newDataStatusType = DATA_STATUS_TYPE.PL_VAC_STATUS;
        break;
      case COMPANY_NAME.TNG:
      default:
        newDataStatusType = DATA_STATUS_TYPE.PL_TNG_STATUS;
        break;
    }

    this.allColumns.forEach((column) => {
      if (column.key === 'status') {
        column.format = newDataStatusType;
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

  private _getLoanList() {
    let params = this._buildParams();
    this.breadcrumbOptions.title =
      this.multiLanguageService.instant('breadcrumb.manage_payday_loan') +
      ' - ' +
      this.groupName;
    switch (params.groupName) {
      case COMPANY_NAME.HMG:
        this.filterOptions[2].options = this.statusFilterOptionsHmg;
        this.loanListService
          .getLoanDataHmg(params)
          .subscribe(
            (data: ApiResponseSearchAndPaginationResponsePaydayLoanHmg) => {
              this._parseData(data?.result);
              this.getOverviewData(data?.result);
            }
          );
        break;
      case COMPANY_NAME.TNG:
        this.filterOptions[2].options = this.statusFilterOptionsTng;
        this.loanListService
          .getLoanDataTng(params, APPLICATION_TYPE.PDL_TNG)
          .subscribe(
            (data: ApiResponseSearchAndPaginationResponsePaydayLoanTng) => {
              this._parseData(data?.result);
              this.getOverviewData(data?.result);
            }
          );
        break;
      case COMPANY_NAME.VAC:
        this.filterOptions[2].options = this.statusFilterOptionsVac;
        this.loanListService
          .getLoanDataTng(params, APPLICATION_TYPE.PDL_VAC)
          .subscribe(
            (data: ApiResponseSearchAndPaginationResponsePaydayLoanTng) => {
              this._parseData(data?.result);
              this.getOverviewData(data?.result);
            }
          );
        break;
      default:
        break;
    }
  }

  private _initCompanyOptions(groupName) {
    this.filterOptions.forEach((filterOption: FilterOptionModel) => {
      if (filterOption.controlName !== 'companyId') {
        return;
      }
      filterOption.options[0].subOptions = this.companyList
        ?.filter((company: CompanyInfo) => company.groupName === groupName)
        .map((company: CompanyInfo) => {
          return {
            title: company.name + ' (' + company.code + ')',
            value: company.id,
            imgSrc: company.avatar,
            code: company.code,
          };
        });
    });
  }

  private _buildParams() {
    const data = this.filterForm.getRawValue();
    data.offset = this.pageIndex * this.pageSize;
    data.pageSize = this.pageSize;
    data.pageNumber = this.pageIndex;
    return data;
  }

  private _parseData(rawData: SearchAndPaginationResponsePaydayLoanHmg) {
    this.pageLength = rawData?.pagination?.maxPage || 0;
    this.totalItems = rawData?.pagination?.total || 0;
    this.dataSource.data = rawData?.data || [];
  }

  getOverviewData(rawData: SearchAndPaginationResponsePaydayLoanHmg) {
    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant(
          'loan_app.loan_info.total_loan_number'
        )
    ).value = rawData?.pagination?.total;

    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant(
          'loan_app.loan_info.total_loan_amount_number'
        )
    ).value = rawData?.meta?.totalAmounts;

    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant(
          'loan_app.loan_info.total_late_penalty_number'
        )
    ).value = rawData?.meta?.totalLatePenaltyPayment;
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

  onClickBtnExport(event) {
    let params = this._buildParams();
    switch (this.groupName) {
      case COMPANY_NAME.HMG:
        this.loanListService.exportHmgLoanToExcel(params).subscribe((data) => {
          if (!data) {
            return this.notifier.error(
              this.multiLanguageService.instant(
                'loan_app.loan_contract.downloading_fail'
              )
            );
          }
          this.downloadExcelFile(data);
        });
        break;

      case COMPANY_NAME.TNG:
        this.loanListService
          .exportLoanToExcel(params, APPLICATION_TYPE.PDL_TNG)
          .subscribe((data) => {
            if (!data) {
              return this.notifier.error(
                this.multiLanguageService.instant(
                  'loan_app.loan_contract.downloading_fail'
                )
              );
            }
            this.downloadExcelFile(data);
          });
        break;
      case COMPANY_NAME.VAC:
        this.loanListService
          .exportLoanToExcel(params, APPLICATION_TYPE.PDL_VAC)
          .subscribe((data) => {
            if (!data) {
              return this.notifier.error(
                this.multiLanguageService.instant(
                  'loan_app.loan_contract.downloading_fail'
                )
              );
            }
            this.downloadExcelFile(data);
          });
        break;
      default:
        break;
    }
  }

  public downloadExcelFile(data) {
    const convertData = this.loanListService.convertBlobType(
      data,
      'application/xlxs'
    );
    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', convertData);
    a.setAttribute('rel', 'noopener');
    const startTime = this.filterForm.getRawValue().startTime
      ? '-' + moment(this.filterForm.getRawValue().startTime).format('DDMMYYYY')
      : '';
    const endTime = this.filterForm.getRawValue().endTime
      ? '-' + moment(this.filterForm.getRawValue().endTime).format('DDMMYYYY')
      : '';
    const convertFile =
      'DanhSachKhoanUng-' + this.groupName + startTime + endTime + '.xlsx';
    a.setAttribute('download', convertFile);
    document.body.appendChild(a);
    a.click();
    a.remove();
    this.notifier.info(
      this.multiLanguageService.instant('loan_app.loan_contract.downloading')
    );
  }

  private async _checkUserPermissions() {
    switch (this.groupName) {
      case COMPANY_NAME.TNG:
        await this._checkPermissionTng();
        this._displayStatusFilterOptionsTng();
        break;
      case COMPANY_NAME.VAC:
        await this._checkPermissionVac();
        this._displayStatusFilterOptionsVac();
        break;
      default:
        break;
    }
  }

  private async _checkPermissionTng() {
    this.userHasPermissions.loanTngViewStatus.initialized =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.INITIALIZED
      );
    this.userHasPermissions.loanTngViewStatus.auction =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.AUCTION
      );
    this.userHasPermissions.loanTngViewStatus.document_awaiting =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.DOCUMENT_AWAITING
      );
    this.userHasPermissions.loanTngViewStatus.documentation_complete =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION
          .DOCUMENTATION_COMPLETE
      );
    this.userHasPermissions.loanTngViewStatus.funded =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.FUNDED
      );
    this.userHasPermissions.loanTngViewStatus.contract_accepted =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.CONTRACT_ACCEPTED
      );
    this.userHasPermissions.loanTngViewStatus.awaiting_disbursement =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION
          .AWAITING_DISBURSEMENT
      );
    this.userHasPermissions.loanTngViewStatus.disbursed =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.DISBURSED
      );
    this.userHasPermissions.loanTngViewStatus.in_repayment =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.IN_REPAYMENT
      );
    this.userHasPermissions.loanTngViewStatus.completed =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.COMPLETED
      );
    this.userHasPermissions.loanTngViewStatus.rejected =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.REJECTED
      );
    this.userHasPermissions.loanTngViewStatus.withdraw =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.WITHDRAW
      );
    this.userHasPermissions.loanTngViewStatus.contract_rejected =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_TNG_STATUS_PERMISSION.CONTRACT_REJECTED
      );
  }

  private async _checkPermissionVac() {
    this.userHasPermissions.loanVacViewStatus.initialized =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.INITIALIZED
      );
    this.userHasPermissions.loanVacViewStatus.auction =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.AUCTION
      );
    this.userHasPermissions.loanVacViewStatus.document_awaiting =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.DOCUMENT_AWAITING
      );
    this.userHasPermissions.loanVacViewStatus.documentation_complete =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION
          .DOCUMENTATION_COMPLETE
      );
    this.userHasPermissions.loanVacViewStatus.funded =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.FUNDED
      );
    this.userHasPermissions.loanVacViewStatus.contract_accepted =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.CONTRACT_ACCEPTED
      );
    this.userHasPermissions.loanVacViewStatus.awaiting_disbursement =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION
          .AWAITING_DISBURSEMENT
      );
    this.userHasPermissions.loanVacViewStatus.disbursed =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.DISBURSED
      );
    this.userHasPermissions.loanVacViewStatus.in_repayment =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.IN_REPAYMENT
      );
    this.userHasPermissions.loanVacViewStatus.completed =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.COMPLETED
      );
    this.userHasPermissions.loanVacViewStatus.rejected =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.REJECTED
      );
    this.userHasPermissions.loanVacViewStatus.withdraw =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.WITHDRAW
      );
    this.userHasPermissions.loanVacViewStatus.contract_rejected =
      await this.permissionsService.hasPermission(
        PermissionConstants.VIEW_LOAN_VAC_STATUS_PERMISSION.CONTRACT_REJECTED
      );
  }

  private _displayStatusFilterOptionsTng() {
    this.statusFilterOptionsTng.forEach((option) => {
      switch (option.value) {
        case PAYDAY_LOAN_STATUS.INITIALIZED:
          option.hidden =
            !this.userHasPermissions.loanTngViewStatus.initialized;
          break;
        case PAYDAY_LOAN_STATUS.AUCTION:
          option.hidden = !this.userHasPermissions.loanTngViewStatus.auction;
          break;
        case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
          option.hidden =
            !this.userHasPermissions.loanTngViewStatus.document_awaiting;
          break;
        case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
          option.hidden =
            !this.userHasPermissions.loanTngViewStatus.documentation_complete;
          break;
        case PAYDAY_LOAN_STATUS.FUNDED:
          option.hidden = !this.userHasPermissions.loanTngViewStatus.funded;
          break;
        case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
          option.hidden =
            !this.userHasPermissions.loanTngViewStatus.contract_accepted;
          break;
        case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
          option.hidden =
            !this.userHasPermissions.loanTngViewStatus.awaiting_disbursement;
          break;
        case PAYDAY_LOAN_STATUS.DISBURSED:
          option.hidden = !this.userHasPermissions.loanTngViewStatus.disbursed;
          break;
        case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        case REPAYMENT_STATUS.OVERDUE:
        case DEBT_STATUS.BADDEBT:
          option.hidden =
            !this.userHasPermissions.loanTngViewStatus.in_repayment;
          break;
        case PAYDAY_LOAN_STATUS.COMPLETED:
          option.hidden = !this.userHasPermissions.loanTngViewStatus.completed;
          break;
        case PAYDAY_LOAN_STATUS.WITHDRAW:
          option.hidden = !this.userHasPermissions.loanTngViewStatus.withdraw;
          break;
        case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
          option.hidden =
            !this.userHasPermissions.loanTngViewStatus.contract_rejected;
          break;
        case PAYDAY_LOAN_STATUS.REJECTED:
          option.hidden = !this.userHasPermissions.loanTngViewStatus.rejected;
          break;
        default:
          break;
      }
    });
    this.filterOptions[2].options = this.statusFilterOptionsTng;
    this.changeCompanyGroupName(this.groupName);
  }

  private _displayStatusFilterOptionsVac() {
    this.statusFilterOptionsVac.forEach((option) => {
      switch (option.value) {
        case PAYDAY_LOAN_STATUS.INITIALIZED:
          option.hidden =
            !this.userHasPermissions.loanVacViewStatus.initialized;
          break;
        case PAYDAY_LOAN_STATUS.AUCTION:
          option.hidden = !this.userHasPermissions.loanVacViewStatus.auction;
          break;
        case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
          option.hidden =
            !this.userHasPermissions.loanVacViewStatus.document_awaiting;
          break;
        case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
          option.hidden =
            !this.userHasPermissions.loanVacViewStatus.documentation_complete;
          break;
        case PAYDAY_LOAN_STATUS.FUNDED:
          option.hidden = !this.userHasPermissions.loanVacViewStatus.funded;
          break;
        case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
          option.hidden =
            !this.userHasPermissions.loanVacViewStatus.contract_accepted;
          break;
        case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
          option.hidden =
            !this.userHasPermissions.loanVacViewStatus.awaiting_disbursement;
          break;
        case PAYDAY_LOAN_STATUS.DISBURSED:
          option.hidden = !this.userHasPermissions.loanVacViewStatus.disbursed;
          break;
        case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        case REPAYMENT_STATUS.OVERDUE:
        case DEBT_STATUS.BADDEBT:
          option.hidden =
            !this.userHasPermissions.loanVacViewStatus.in_repayment;
          break;
        case PAYDAY_LOAN_STATUS.COMPLETED:
          option.hidden = !this.userHasPermissions.loanVacViewStatus.completed;
          break;
        case PAYDAY_LOAN_STATUS.WITHDRAW:
          option.hidden = !this.userHasPermissions.loanVacViewStatus.withdraw;
          break;
        case PAYDAY_LOAN_STATUS.CONTRACT_REJECTED:
          option.hidden =
            !this.userHasPermissions.loanVacViewStatus.contract_rejected;
          break;
        case PAYDAY_LOAN_STATUS.REJECTED:
          option.hidden = !this.userHasPermissions.loanVacViewStatus.rejected;
          break;
        default:
          break;
      }
    });
    this.filterOptions[2].options = this.statusFilterOptionsVac;
    this.changeCompanyGroupName(this.groupName);
  }

  ngOnDestroy(): void {
    if (this.subManager !== null) {
      this.subManager.unsubscribe();
    }
  }
}
