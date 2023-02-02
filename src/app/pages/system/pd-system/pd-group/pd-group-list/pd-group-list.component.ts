import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Sort } from '@angular/material/sort';
import { FilterEventModel } from '../../../../../public/models/filter/filter-event.model';
import { PageEvent } from '@angular/material/paginator/public-api';
import { FilterActionEventModel } from '../../../../../public/models/filter/filter-action-event.model';
import {
  AddNewPdDialogComponent,
  BaseManagementLayoutComponent,
  MerchantGroupDialogComponent,
} from '../../../../../share/components';
import { PdGroupListService } from './pd-group-list.service';
import { Observable, Subscription } from 'rxjs';
import {
  ApiResponsePaginationPdQuestions,
  CdeService,
} from '../../../../../../../open-api-modules/monexcore-api-docs';
import { CustomApiResponse, PDGroup } from '../../pd-interface';

import * as fromStore from '../../../../../core/store';
import * as fromSelectors from '../../../../../core/store/selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-pd-group-list',
  templateUrl: './pd-group-list.component.html',
  styleUrls: ['./pd-group-list.component.scss'],
})
export class PdGroupListComponent implements OnInit, OnDestroy {
  //Mock data
  allColumns: any[] = [
    {
      key: 'code',
      title: this.multiLanguageService.instant('pd_system.pd_group.id'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'content',
      title: this.multiLanguageService.instant('pd_system.pd_group.name'),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'description',
      title: this.multiLanguageService.instant(
        'pd_system.pd_group.description'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'pd_system.pd_group.created_date'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: true,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant('pd_system.pd_group.status'),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.USER_STATUS,
      showed: true,
    },
  ];
  tableTitle: string = this.multiLanguageService.instant(
    'pd_system.pd_group.title'
  );
  hasSelect: boolean = true;
  selectButtons: TableSelectActionModel[] = [
    {
      hidden: false,
      action: MULTIPLE_ELEMENT_ACTION_TYPE.DELETE,
      color: 'accent',
      content: this.multiLanguageService.instant('pd_system.pd_group.delete'),
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
  questionList;
  totalItems: number = 0;
  filterForm: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pages: Array<number>;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  expandedElementId: number;
  subManager = new Subscription();
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.pd_group'),
    iconImgSrc: 'assets/img/icon/group-7/svg/setting-green.svg',
    searchPlaceholder: 'Mã nhóm câu hỏi, tên nhóm câu hỏi',
    searchable: true,
    showBtnAdd: true,
    btnAddText: this.multiLanguageService.instant(
      'pd_system.pd_group.add_group'
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
    private pdGroupListService: PdGroupListService,
    private cdeService: CdeService,
    private store: Store<fromStore.State>
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnInit(): void {
    this._initSubscription();
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        if (params?.url.includes(window.location.pathname)) {
          this._parseQueryParams(params?.queryParams);
          this._getGroupList();
          this._getQuestionList();
        } else {
          this.dataSource.data = [];
        }
      })
    );
  }

  public _getQuestionList() {
    this.subManager.add(
      this.cdeService
        .cdeControllerSearchPdQuestionPagination(
          true,
          1,
          100,
          'createdAt',
          JSON.stringify({})
        )
        .subscribe((data: ApiResponsePaginationPdQuestions) => {
          this.questionList = data?.result['items'];
          this.questionList = this.questionList.map((item) => {
            return {
              id: item.objectId,
              content: item.content,
            };
          });
        })
    );
    // this.subManager.add(
    //   this.cdeService
    //     .cdeControllerGetPdQuestion()
    //     .subscribe((data: CustomApiResponse<PdQuestion>) => {
    //       this.questionList = data.result;
    //       this.questionList = this.questionList.map((item) => {
    //         return {
    //           id: item.id,
    //           content: item.content,
    //         };
    //       });
    //     })
    // );
  }

  public _getGroupList() {
    const params = this._buildParams();
    this.pdGroupListService.getData(params).subscribe((data) => {
      this._parseData(data?.result);
      let list = data?.result['items'].map((item: any) => {
        return {
          ...item,
          code: item.code + '-' + item.objectId,
        };
      });
      this.dataSource.data = list;
    });
    // this.subManager.add(
    //   this.cdeService.cdeControllerGetPdGroup().subscribe((data) => {
    //     // @ts-ignore
    //     this.dataSource.data = data?.result;
    //   })
    // );
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
    this.pageLength = rawData?.meta?.totalPages || 0;
    this.totalItems = rawData?.meta?.totalItems || 0;
    this.dataSource.data = rawData?.items || [];
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
    const idArr = list.map((group) => group.objectId);
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
          this.multiLanguageService.instant('pd_system.pd_group.delete_toast')
        );
        this.refreshContent();
      }
    }, 2000);
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

  private _lockById(id: string) {
    if (!id) {
      return;
    }
    // this.subManager.add(
    //   this.adminControllerService
    //     .v1AdminMerchantsIdPut(merchantId, {status: 'LOCKED'})
    //     .subscribe(
    //       (result: ApiResponseMerchant) => {
    //         if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
    //           return this.notifier.error(
    //             JSON.stringify(result?.message),
    //             result?.errorCode
    //           );
    //         }
    //
    //         this.notifier.success(
    //           this.multiLanguageService.instant(
    //             'merchant.merchant_detail.lock_merchant.toast'
    //           )
    //         );
    //       },
    //       (error) => {
    //       },
    //       () => {
    //         setTimeout(() => {
    //           this.triggerDeselectUsers();
    //           this.refreshContent();
    //         }, 3000);
    //       }
    //     )
    // );
  }

  public deleteMultiplePrompt(ids) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant('pd_system.pd_group.delete'),
      content: this.multiLanguageService.instant(
        'pd_system.pd_group.delete_content'
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
      this.cdeService
        .cdeControllerDeletePdGroup(id, {})
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
    this.openUpdateDialog(element);
  }

  public openUpdateDialog(info: PDGroup) {
    let leftArr = [...this.questionList];
    let rightArr = [];
    let groupQuestions = info.pdGroupQuestions;
    if (groupQuestions) {
      groupQuestions = groupQuestions.filter(
        (groupQuestion) => groupQuestion.pdQuestion !== null
      );
      rightArr = groupQuestions.map((ele) => {
        return {
          id: ele.pdQuestionId,
          content: ele.pdQuestion.content,
          order: ele.order,
        };
      });
      let ids = rightArr.map((ele) => ele.id);
      leftArr = leftArr.filter((ele) => !ids.includes(ele.id));
    }

    const addGroupDialogRef = this.dialog.open(AddNewPdDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '1200px',
      width: '90%',
      data: {
        isPdGroup: true,
        dialogTitle: 'Chỉnh sửa nhóm câu hỏi',
        inputName: 'Tên nhóm câu hỏi',
        inputCode: 'Mã nhóm câu hỏi',
        listTitle: 'Danh sách câu hỏi',
        pdInfo: info,
        leftArr: leftArr,
        rightArr: rightArr,
      },
    });
    this.subManager.add(
      addGroupDialogRef.afterClosed().subscribe((result: any) => {
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

  onClickBtnAdd(event) {
    const addGroupDialogRef = this.dialog.open(AddNewPdDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '1200px',
      width: '90%',
      data: {
        isPdGroup: true,
        leftArr: this.questionList,
        dialogTitle: 'Thêm nhóm câu hỏi',
        inputName: 'Tên nhóm câu hỏi',
        inputCode: 'Mã nhóm câu hỏi',
        listTitle: 'Danh sách câu hỏi',
      },
    });
    this.subManager.add(
      addGroupDialogRef.afterClosed().subscribe((result: any) => {
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
      this.cdeService.cdeControllerCreatePdGroup(createRequest).subscribe(
        (result: CustomApiResponse<PDGroup>) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          } else {
            if (addRequest) {
              for (let i = 0; i < addRequest.length; i++) {
                this.cdeService
                  .cdeControllerUpdatePdGroupQuestion(
                    result.result.id,
                    'add',
                    addRequest[i]
                  )
                  .subscribe((result) => {});
              }
            }
          }
        },
        () => {},
        () => {
          this.notifier.success(
            this.multiLanguageService.instant(
              'pd_system.add_pd_dialog.create_group_success'
            )
          );
          this.refreshContent();
          this.notificationService.hideLoading();
        }
      )
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
      this.cdeService
        .cdeControllerUpdatePdGroup(id, update)
        .subscribe((result: CustomApiResponse<PDGroup>) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          } else {
            if (addRequest) {
              for (let i = 0; i < addRequest.length; i++) {
                this.cdeService
                  .cdeControllerUpdatePdGroupQuestion(id, 'add', addRequest[i])
                  .subscribe((result) => {});
              }
            }
            if (updateRequest) {
              for (let i = 0; i < updateRequest.length; i++) {
                this.cdeService
                  .cdeControllerUpdatePdGroupQuestion(
                    id,
                    'update',
                    updateRequest[i]
                  )
                  .subscribe((result) => {});
              }
            }
            if (removeRequest) {
              for (let i = 0; i < removeRequest.length; i++) {
                this.cdeService
                  .cdeControllerUpdatePdGroupQuestion(
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
      this.triggerDeselectUsers();
      this._getGroupList();
    }, 2000);
  }

  private _bindingDialogData(data, type?) {
    if (type === 'create') {
      return {
        code: data?.code,
        content: data?.content,
        description: data?.description ? data?.description : null,
        status: data?.status,
      };
    } else {
      let requestArray = [];
      for (let i = 0; i < data.length; i++) {
        requestArray.push({
          questionId: data[i].id,
          order: data[i].order,
        });
      }
      return requestArray;
    }
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
}
