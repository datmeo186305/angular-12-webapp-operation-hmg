import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  FILTER_ACTION_TYPE,
  FILTER_TYPE,
  MULTIPLE_ELEMENT_ACTION_TYPE,
  QUERY_CONDITION_TYPE,
} from '../../../../../core/common/enum/operator';
import { TableSelectActionModel } from '../../../../../public/models/external/table-select-action.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BreadcrumbOptionsModel } from '../../../../../public/models/external/breadcrumb-options.model';
import { FilterOptionModel } from '../../../../../public/models/filter/filter-option.model';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { PermissionConstants } from '../../../../../core/common/constants/permission-constants';
import { Sort } from '@angular/material/sort';
import { FilterEventModel } from '../../../../../public/models/filter/filter-event.model';
import { PageEvent } from '@angular/material/paginator/public-api';
import { FilterActionEventModel } from '../../../../../public/models/filter/filter-action-event.model';
import {
  MerchantDetailDialogComponent,
  MerchantGroupDialogComponent,
} from '../../../../../share/components';
import { environment } from '../../../../../../environments/environment';
import { Observable, Subscription } from 'rxjs';
import * as fromStore from '../../../../../core/store';
import * as fromSelectors from '../../../../../core/store/selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-pd-answers-list',
  templateUrl: './pd-answers-list.component.html',
  styleUrls: ['./pd-answers-list.component.scss'],
})
export class PdAnswersListComponent implements OnInit, OnDestroy {
  //Mock data
  merchantList: any[] = [
    {
      id: 'PDA-268',
      question: 'Câu hỏi số 1',
      content: 'Câu trả lời số 1',
      createdDate: '09/12/2021 16:20',
      updateDate: '09/12/2021 05:21',
    },
    {
      id: 'PDA-142',
      question: 'Câu hỏi số 2',
      content: 'Câu trả lời số 2',
      createdDate: '12/21/2021 16:20',
      updateDate: '10/12/2021 05:21',
    },
    {
      id: 'PDA-521',
      question: 'Câu hỏi số 3',
      content: 'Câu trả lời số 3',
      createdDate: '06/21/2021 16:20',
      updateDate: '10/11/2021 05:21',
    },
    {
      id: 'PDA-831',
      question: 'Câu hỏi số 4',
      content: 'Câu trả lời số 4',
      createdDate: '09/12/2021 16:20',
      updateDate: '09/12/2021 05:21',
    },
    {
      id: 'PDA-028',
      question: 'Câu hỏi số 5',
      content: 'Câu trả lời số 5',
      createdDate: '09/12/2021 16:20',
      updateDate: '09/12/2021 05:21',
    },
  ];
  allColumns: any[] = [
    {
      key: 'id',
      title: this.multiLanguageService.instant('pd_system.pd_answers.id'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'question',
      title: this.multiLanguageService.instant('pd_system.pd_answers.question'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'content',
      title: this.multiLanguageService.instant('pd_system.pd_answers.content'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'createdDate',
      title: this.multiLanguageService.instant(
        'pd_system.pd_answers.created_date'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: true,
    },
    {
      key: 'updateDate',
      title: this.multiLanguageService.instant(
        'pd_system.pd_answers.update_date'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: true,
    },
  ];
  tableTitle: string = this.multiLanguageService.instant(
    'pd_system.pd_answers.title'
  );
  hasSelect: boolean = false;
  selectButtons: TableSelectActionModel[];
  totalItems: number = 0;
  filterForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  expandedElementId: number;
  merchantInfo: any;
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.pd_answers'),
    iconImgSrc: 'assets/img/icon/group-7/svg/setting-green.svg',
    searchPlaceholder: 'Mã câu trả lời, câu hỏi, nội dung câu trả lời',
    searchable: true,
    showBtnAdd: true,
    btnAddText: this.multiLanguageService.instant(
      'pd_system.pd_answers.add_answer'
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
    // {
    //   title: this.multiLanguageService.instant('filter.merchant_group'),
    //   type: FILTER_TYPE.MULTIPLE_CHOICE,
    //   controlName: 'companyId',
    //   value: null,
    //   showAction: true,
    //   titleAction: 'Thêm nhóm nhà cung cấp',
    //   actionIconClass: 'sprite-group-7-add-blue',
    //   options: [
    //     {
    //       title: 'Nhóm nhà cung cấp 1',
    //       note: '',
    //       value: '1',
    //       showAction: true,
    //       actionTitle: 'Sửa nhóm nhà cung cấp',
    //       actionIconClass: 'sprite-group-5-edit-blue',
    //       subTitle: 'casca',
    //       disabled: false,
    //       count: 0,
    //     },
    //     {
    //       title: 'Nhóm nhà cung cấp 2',
    //       note: 'zz',
    //       value: '2',
    //       showAction: true,
    //       actionTitle: 'Sửa nhóm nhà cung cấp',
    //       actionIconClass: 'sprite-group-5-edit-blue',
    //       subTitle: 'váv',
    //       disabled: false,
    //       count: 0,
    //     },
    //   ],
    // },
    // {
    //   title: this.multiLanguageService.instant('filter.account_status'),
    //   type: FILTER_TYPE.SELECT,
    //   controlName: 'unknow',
    //   value: null,
    //   options: [
    //     {
    //       title: this.multiLanguageService.instant('common.all'),
    //       value: null,
    //     },
    //     {
    //       title: this.multiLanguageService.instant('common.active'),
    //       value: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_EKYC_YET,
    //     },
    //     {
    //       title: this.multiLanguageService.instant('common.inactive'),
    //       value: PAYDAY_LOAN_UI_STATUS.NOT_COMPLETE_FILL_EKYC_YET,
    //     },
    //   ],
    // },
  ];

  subManager = new Subscription();

  private readonly routeAllState$: Observable<Params>;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromStore.State>
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   this.multiLanguageService.instant('page_title.merchant_list') +
    //     ' - ' +
    //     environment.PROJECT_NAME
    // );
    this.dataSource.data = this.merchantList;
    // this._initSubscription();
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        if (params?.url.includes(window.location.pathname)) {
          this._parseQueryParams(params?.queryParams);
        } else {
          this.dataSource.data = [];
        }
      })
    );
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
        if (event.controlName === 'companyId') {
          this.filterForm.controls.companyId.setValue(
            event.value ? event.value.join(',') : ''
          );
        } else if (event.controlName === 'paydayLoanStatus') {
          this.filterForm.controls.paydayLoanStatus.setValue(event.value);
        }
        break;
      default:
        break;
    }
    this._onFilterChange();
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      companyId: [''],
      paydayLoanStatus: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        companyId: QUERY_CONDITION_TYPE.IN,
        paydayLoanStatus: QUERY_CONDITION_TYPE.EQUAL,
      },
    });
  }

  private _parseQueryParams(params) {
    let filterConditionsValue =
      this.filterForm.controls.filterConditions?.value;
    for (const [param, paramValue] of Object.entries(params)) {
      let paramHasCondition = param.split('__');
      if (paramHasCondition.length > 1) {
        this.filterForm.controls[paramHasCondition[0]].setValue(
          paramValue || ''
        );
        filterConditionsValue[paramHasCondition[0]] =
          '__' + paramHasCondition[1];
      } else {
        if (this.filterForm.controls[param]) {
          this.filterForm.controls[param].setValue(paramValue || '');
        }
      }
    }
    this.filterForm.controls.filterConditions.setValue(filterConditionsValue);
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
      } else if (filterOption.controlName === 'paydayLoanStatus') {
        filterOption.value = this.filterForm.controls.paydayLoanStatus.value;
      }
    });
    this.breadcrumbOptions.keyword = params.keyword;
    this.pageIndex = params.pageIndex || 0;
    this.pageSize = params.pageSize || 20;
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

  public onOutputAction(event) {
    const action = event.action;
    const list = event.selectedList;
    switch (action) {
      case MULTIPLE_ELEMENT_ACTION_TYPE.LOCK:
        this.lockPrompt();
        break;
      case MULTIPLE_ELEMENT_ACTION_TYPE.DELETE:
        this.deletePrompt();
        break;
      default:
        return;
    }
  }

  // @ts-ignore
  public lockPrompt(): boolean {
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
    confirmLockRef.afterClosed().subscribe((result) => {});
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
        this.notifier.success(
          this.multiLanguageService.instant(
            'system.user_detail.delete_user.toast'
          )
        );
      }
    });
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._onFilterChange();
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {
    if (event.type === FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION) {
      const addMerchantGroupDialogRef = this.dialog.open(
        MerchantGroupDialogComponent,
        {
          panelClass: 'custom-info-dialog-container',
          maxWidth: '360px',
          width: '90%',
        }
      );
    } else {
      const editMerchantGroupDialogRef = this.dialog.open(
        MerchantGroupDialogComponent,
        {
          panelClass: 'custom-info-dialog-container',
          maxWidth: '360px',
          width: '90%',
          data: {
            merchantGroupInfo: this.filterOptions[0].options.filter(
              (option) => option.value === event.value
            )[0],
            dialogTitle: this.multiLanguageService.instant(
              'merchant.merchant_dialog.edit_group_title'
            ),
          },
        }
      );
    }
  }

  public onExpandElementChange(element: any) {
    this.expandedElementId = element.merchantId;
    this.merchantInfo = this.merchantList.filter(
      (merchant) => merchant.merchantId === element.merchantId
    )[0];
  }

  onClickBtnAdd(event) {
    const addMerchantDialogRef = this.dialog.open(
      MerchantDetailDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '800px',
        width: '90%',
      }
    );
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
}
