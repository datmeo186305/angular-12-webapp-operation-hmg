import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseManagementLayoutComponent } from '../../../../../share/components';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  FILTER_TYPE,
  RESPONSE_CODE,
  TABLE_ACTION_TYPE,
} from '../../../../../core/common/enum/operator';
import { TableSelectActionModel } from '../../../../../public/models/external/table-select-action.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { BreadcrumbOptionsModel } from '../../../../../public/models/external/breadcrumb-options.model';
import { FilterOptionModel } from '../../../../../public/models/filter/filter-option.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import {
  CdeService,
  ContractTemplate,
  CreateContractDto,
  UpdateContractDto,
} from '../../../../../../../open-api-modules/monexcore-api-docs';
import { Store } from '@ngrx/store';
import * as fromSelectors from '../../../../../core/store/selectors';
import { FilterActionEventModel } from '../../../../../public/models/filter/filter-action-event.model';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { FilterEventModel } from '../../../../../public/models/filter/filter-event.model';
import * as fromStore from '../../../../../core/store';
import * as fromActions from '../../../../../core/store';
import { TableActionButtonModel } from '../../../../../public/models/external/table-action-button.model';
import { OverviewItemModel } from '../../../../../public/models/external/overview-item.model';
import { ConfigContractListService } from './config-contract-list.service';
import { ConfigContractSaveDialogComponent } from '../components/config-contract-save-dialog/config-contract-save-dialog.component';
import { TableActionEventModel } from '../../../../../public/models/external/table-action-event.model';

@Component({
  selector: 'app-config-contract-list',
  templateUrl: './config-contract-list.component.html',
  styleUrls: ['./config-contract-list.component.scss'],
})
export class ConfigContractListComponent implements OnInit, OnDestroy {
  @ViewChild(BaseManagementLayoutComponent)
  child: BaseManagementLayoutComponent;

  allColumns: any[] = [
    {
      key: 'name',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_template.name'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'product.name',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_template.product_name'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'isActive',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_template.status'
      ),
      type: DATA_CELL_TYPE.BOOLEAN,
      format: null,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_template.created_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
  ];
  tableTitle: string = this.multiLanguageService.instant(
    'system.system_config.contract_template.title'
  );
  hasSelect: boolean = false;
  selectButtons: TableSelectActionModel[] = [];

  productList: any[];
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
  hasActions: boolean = true;
  breadcrumbOptions: BreadcrumbOptionsModel = {
    title: this.multiLanguageService.instant('breadcrumb.contract_template'),
    iconImgSrc: 'assets/img/icon/group-7/svg/setting-green.svg',
    searchable: false,
    showBtnAdd: true,
    btnAddText: this.multiLanguageService.instant(
      'system.system_config.contract_template.add'
    ),
    keyword: '',
  };
  filterOptions: FilterOptionModel[] = [
    // {
    //   title: this.multiLanguageService.instant('filter.time'),
    //   type: FILTER_TYPE.DATETIME,
    //   controlName: 'createAt',
    //   value: null,
    // },
  ];

  actionButtons: TableActionButtonModel[] = [
    {
      hidden: false,
      action: TABLE_ACTION_TYPE.VIEW,
      color: 'accent',
      tooltip: this.multiLanguageService.instant('common.view'),
      imageSrc: 'assets/img/icon/group-5/svg/eye.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
    {
      hidden: false,
      action: TABLE_ACTION_TYPE.EDIT,
      color: 'accent',
      tooltip: this.multiLanguageService.instant('common.edit'),
      imageSrc: 'assets/img/icon/group-5/svg/edit-small.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
    {
      hidden: false,
      action: TABLE_ACTION_TYPE.DELETE,
      color: 'accent',
      tooltip: this.multiLanguageService.instant('common.delete'),
      imageSrc: 'assets/img/icon/group-5/svg/trash-red.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
  ];

  overviewItems: OverviewItemModel[] = [
    {
      field: this.multiLanguageService.instant(
        'system.system_config.contract_template.total'
      ),
      value: 0,
    },
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
    private configContractListService: ConfigContractListService,
    private cdeService: CdeService,
    private store: Store<fromStore.State>
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(null));
    this._initSubscription();
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        if (params?.url.includes(window.location.pathname)) {
          this._parseQueryParams(params?.queryParams);
          this._getContractTemplateList();
        } else {
          this.dataSource.data = [];
        }
      })
    );
  }

  public onExpandElementChange(element: any) {
    // this.openUpdateDialog(element);
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {}

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
        break;
      default:
        break;
    }
    this._onFilterChange();
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      keyword: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {},
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
      }
    });
    this.breadcrumbOptions.keyword = params.keyword;
    this.pageIndex = params.pageIndex || 0;
    this.pageSize = params.pageSize || 10;
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

  public _getContractTemplateList() {
    const params = this._buildParams();
    this.configContractListService.getData(params).subscribe((data) => {
      this._parseData(data?.result);
      this.getOverviewData(data?.result);
    });
  }

  triggerDeselectUsers() {
    this.child.triggerDeselectUsers();
  }

  public refreshContent() {
    setTimeout(() => {
      this.triggerDeselectUsers();
      this._getContractTemplateList();
    }, 2000);
  }

  openUpdateDialog(info: ContractTemplate, action: TABLE_ACTION_TYPE) {
    const addGroupDialogRef = this.dialog.open(
      ConfigContractSaveDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '1600px',
        width: '90%',
        data: {
          title:
            action === TABLE_ACTION_TYPE.VIEW
              ? this.multiLanguageService.instant(
                  'system.system_config.contract_template.view_form_title'
                )
              : this.multiLanguageService.instant(
                  'system.system_config.contract_template.update_form_title'
                ),
          element: info,
          action: action,
        },
      }
    );
    this.subManager.add(
      addGroupDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateContractDto: UpdateContractDto = {};
          if (result?.data?.name != info?.name) {
            updateContractDto.name = result?.data?.name;
          }
          if (result?.data?.statusFlowId != info?.statusFlow?.id) {
            updateContractDto.statusFlowId = result?.data?.statusFlowId;
            updateContractDto.productId = result?.data?.productId;
          }
          if (result?.data?.content != info?.content) {
            updateContractDto.content = result?.data?.content;
          }
          if (result?.data?.isActive != info?.isActive) {
            updateContractDto.isActive = result?.data?.isActive;
          }

          // Customer signing postion
          let customerPageIndex =
            result?.data?.customerPositionPage > 0
              ? result?.data?.customerPositionPage - 1
              : 0;
          if (customerPageIndex != info?.customerPageIndex) {
            updateContractDto.customerPageIndex = customerPageIndex;
          }
          if (result?.data?.customerPositionX != info?.customerPositionX) {
            updateContractDto.customerPositionX =
              result?.data?.customerPositionX;
          }
          if (result?.data?.customerPositionY != info?.customerPositionY) {
            updateContractDto.customerPositionY =
              result?.data?.customerPositionY;
          }
          if (result?.data?.customerWidth != info?.customerWidth) {
            updateContractDto.customerWidth = result?.data?.customerWidth;
          }
          if (result?.data?.customerHeight != info?.customerHeight) {
            updateContractDto.customerHeight = result?.data?.customerHeight;
          }

          // Monex signing postion
          let monexPageIndex =
            result?.data?.monexPositionPage > 0
              ? result?.data?.monexPositionPage - 1
              : 0;
          if (monexPageIndex != info?.monexPageIndex) {
            updateContractDto.monexPageIndex = monexPageIndex;
          }
          if (result?.data?.monexPositionX != info?.monexPositionX) {
            updateContractDto.monexPositionX = result?.data?.monexPositionX;
          }
          if (result?.data?.monexPositionY != info?.monexPositionY) {
            updateContractDto.monexPositionY = result?.data?.monexPositionY;
          }
          if (result?.data?.monexWidth != info?.monexWidth) {
            updateContractDto.monexWidth = result?.data?.monexWidth;
          }
          if (result?.data?.monexHeight != info?.monexHeight) {
            updateContractDto.monexHeight = result?.data?.monexHeight;
          }

          this._updateContractTemplate(info.id, updateContractDto, info);
        }
      })
    );
  }

  onClickBtnAdd(event) {
    const contractSaveDialogRef = this.dialog.open(
      ConfigContractSaveDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '1600px',
        width: '90%',
        data: {
          title: this.multiLanguageService.instant(
            'system.system_config.contract_template.add_form_title'
          ),
        },
      }
    );
    this.subManager.add(
      contractSaveDialogRef.afterClosed().subscribe((result: any) => {
        console.log('result', result);
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let createContractDto: CreateContractDto = {
            isActive: result?.data?.isActive,
            productId: result?.data?.productId,
            content: result?.data?.content,
            name: result?.data?.name,
            statusFlowId: result.data?.statusFlowId,
            customerPageIndex:
              result.data?.customerPositionPage > 0
                ? result.data?.customerPositionPage - 1
                : 0,
            customerPositionX: result.data?.customerPositionX,
            customerPositionY: result.data?.customerPositionY,
            customerWidth: result.data?.customerWidth,
            customerHeight: result.data?.customerHeight,
            monexPageIndex:
              result.data?.monexPositionPage > 0
                ? result.data?.monexPositionPage - 1
                : 0,
            monexPositionX: result.data?.monexPositionX,
            monexPositionY: result.data?.monexPositionY,
            monexWidth: result.data?.monexWidth,
            monexHeight: result.data?.monexHeight,
          };
          this._createContractTemplate(createContractDto);
        }
      })
    );
  }

  public openDeleteContractTemplateDialog(element) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_template.delete_prompt.title'
      ),
      content: this.multiLanguageService.instant(
        'system.system_config.contract_template.delete_prompt.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this._deleteContractTemplateById(element?.id);
      }
    });
  }

  private _deleteContractTemplateById(contractTemplateId: string) {
    if (!contractTemplateId) {
      return;
    }
    this.subManager.add(
      this.configContractListService
        .deleteContractTemplate(contractTemplateId)
        .subscribe((result) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }
          this.notifier.success(
            this.multiLanguageService.instant(
              'system.system_config.contract_template.delete_prompt.success'
            )
          );
          this.dataSource.data = this.dataSource.data.filter((element) => {
            return element.id != contractTemplateId;
          });
        })
    );
  }

  private _createContractTemplate(createContractDto: CreateContractDto) {
    if (!createContractDto) {
      return;
    }
    this.subManager.add(
      this.configContractListService
        .createContractTemplate(createContractDto)
        .subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
          this.notifier.success(
            this.multiLanguageService.instant(
              'system.system_config.contract_template.add_success'
            )
          );
          this.refreshContent();
        })
    );
  }

  private _updateContractTemplate(
    id: string,
    updateContractDto: UpdateContractDto,
    element: ContractTemplate
  ) {
    if (!updateContractDto) {
      return;
    }

    this.subManager.add(
      this.configContractListService
        .updateContractTemplate(id, updateContractDto)
        .subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
          this.notifier.success(
            this.multiLanguageService.instant(
              'system.system_config.contract_template.update_success'
            )
          );
          this.dataSource.data = this.dataSource.data.map((obj) => {
            if (obj.id === id) {
              return { ...obj, ...response.result };
            }

            return obj;
          });
        })
    );
  }

  getOverviewData(rawData) {
    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant(
          'system.system_config.contract_template.total'
        )
    ).value = rawData?.meta?.totalItems;
  }

  public onTableActionClick(event: TableActionEventModel) {
    console.log('onTableActionClick', event);
    if (event.action === TABLE_ACTION_TYPE.DELETE) {
      this.openDeleteContractTemplateDialog(event.element);
    } else if (event.action === TABLE_ACTION_TYPE.EDIT) {
      this.openUpdateDialog(event.element, TABLE_ACTION_TYPE.EDIT);
    } else if (event.action === TABLE_ACTION_TYPE.VIEW) {
      this.openUpdateDialog(event.element, TABLE_ACTION_TYPE.VIEW);
    }
  }

  public onRefreshTrigger(event) {
    this._getContractTemplateList();
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
