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
import { NgxPermissionsService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import {
  CreateDocumentTypeDto,
  RequiredDocumentGroupEntity,
  UpdateDocumentTypeDto,
} from '../../../../../../../open-api-modules/monexcore-api-docs';
import { PermissionConstants } from '../../../../../core/common/constants/permission-constants';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  FILTER_ACTION_TYPE,
  FILTER_TYPE,
  MULTIPLE_ELEMENT_ACTION_TYPE,
  RESPONSE_CODE,
  TABLE_ACTION_TYPE,
} from '../../../../../core/common/enum/operator';
import { NotificationService } from '../../../../../core/services/notification.service';
import * as fromActions from '../../../../../core/store';
import * as fromStore from '../../../../../core/store';
import * as fromSelectors from '../../../../../core/store/selectors';
import { BreadcrumbOptionsModel } from '../../../../../public/models/external/breadcrumb-options.model';
import { OverviewItemModel } from '../../../../../public/models/external/overview-item.model';
import { TableActionButtonModel } from '../../../../../public/models/external/table-action-button.model';
import { TableActionEventModel } from '../../../../../public/models/external/table-action-event.model';
import { TableSelectActionModel } from '../../../../../public/models/external/table-select-action.model';
import { FilterActionEventModel } from '../../../../../public/models/filter/filter-action-event.model';
import { FilterEventModel } from '../../../../../public/models/filter/filter-event.model';
import { FilterOptionModel } from '../../../../../public/models/filter/filter-option.model';
import { BaseManagementLayoutComponent } from '../../../../../share/components';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { DocumentTypeSaveDialogComponent } from '../components/document-type-save-dialog/document-type-save-dialog.component';
import { ConfigDocumentListService } from '../config-document-list/config-document-list.service';

@Component({
  selector: 'app-document-type-list',
  templateUrl: './document-type-list.component.html',
  styleUrls: ['./document-type-list.component.scss'],
})
export class DocumentTypeListComponent implements OnInit, OnDestroy {
  @ViewChild(BaseManagementLayoutComponent)
  child: BaseManagementLayoutComponent;

  tableTitle: string = this.multiLanguageService.instant(
    'system.system_config.document_type.title'
  );
  hasSelect: boolean = true;
  hasActions: boolean = true;
  allColumns: any[] = [
    {
      key: 'name',
      title: this.multiLanguageService.instant(
        'system.system_config.document_type.name'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'description',
      title: this.multiLanguageService.instant(
        'system.system_config.document_type.description'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'system.system_config.document_type.created_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: true,
    },
    {
      key: 'updatedAt',
      title: this.multiLanguageService.instant(
        'system.system_config.document_type.updated_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
    {
      key: 'updatedBy',
      title: this.multiLanguageService.instant(
        'system.system_config.document_type.updated_by'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
  ];
  selectButtons: TableSelectActionModel[] = [
    {
      hidden: true,
      action: MULTIPLE_ELEMENT_ACTION_TYPE.DELETE,
      color: 'accent',
      content: this.multiLanguageService.instant(
        'system.system_config.document_type.delete'
      ),
      imageSrc: 'assets/img/icon/group-5/svg/trash.svg',
      style: 'background-color: #dc3545;',
    },
  ];

  documentTypeList: RequiredDocumentGroupEntity[];
  expandedElementApplicationDocumentType: RequiredDocumentGroupEntity;
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
    title: this.multiLanguageService.instant('breadcrumb.config_document_type'),
    iconImgSrc: 'assets/img/icon/group-7/svg/setting-green.svg',
    searchPlaceholder: this.multiLanguageService.instant(
      'breadcrumb.search_field.config_document_type'
    ),
    searchable: false,
    showBtnAdd: false,
    btnAddText: this.multiLanguageService.instant(
      'system.system_config.document_type.add'
    ),
    keyword: '',
  };
  filterOptions: FilterOptionModel[] = [
    // {
    //   title: this.multiLanguageService.instant('filter.time'),
    //   type: FILTER_TYPE.DATETIME,
    //   controlName: 'createdAt',
    //   value: null,
    // },
  ];

  overviewItems: OverviewItemModel[] = [
    {
      field: this.multiLanguageService.instant(
        'system.system_config.document_type.total'
      ),
      value: 0,
    },
  ];

  userHasPermissions = {
    updateDocumentType: false,
    deleteDocumentType: false,
  };

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private configDocumentListService: ConfigDocumentListService,
    private store: Store<fromStore.State>,
    private permissionsService: NgxPermissionsService
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  actionButtons: TableActionButtonModel[] = [
    {
      hidden: true,
      action: TABLE_ACTION_TYPE.EDIT,
      color: 'accent',
      tooltip: this.multiLanguageService.instant('common.edit'),
      imageSrc: 'assets/img/icon/group-5/svg/edit-small.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
    {
      hidden: true,
      action: TABLE_ACTION_TYPE.DELETE,
      color: 'accent',
      tooltip: this.multiLanguageService.instant('common.delete'),
      imageSrc: 'assets/img/icon/group-5/svg/trash-red.svg',
      style: 'background-color: rgba(255, 255, 255, 0.1);',
    },
  ];

  private readonly routeAllState$: Observable<Params>;

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(null));
    this._initSubscription();
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        if (params?.url.includes(window.location.pathname)) {
          this._parseQueryParams(params?.queryParams);
          this._getApplicationDocumentTypeList();
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

  public onExpandElementChange(element: any) {
    // this.openUpdateApplicationDocumentDialog(element);
  }

  public onFilterActionTrigger(event: FilterActionEventModel) {
    if (event.type === FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION) {
      if (event.controlName === 'applicationDocumentType') {
      }
    }
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
      default:
        break;
    }
    this._onFilterChange();
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      id: [''],
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

  private _resetFilterOptions() {
    let newFilterOptions = JSON.parse(JSON.stringify(this.filterOptions));
    newFilterOptions.forEach((filterOption) => {
      filterOption.value = null;
    });
    this.filterOptions = newFilterOptions;
  }

  private _resetFilterForm() {
    this.filterForm.patchValue({
      id: '',
      keyword: '',
      orderBy: 'createdAt',
      sortDirection: 'desc',
      startTime: null,
      endTime: null,
      dateFilterType: '',
      dateFilterTitle: '',
      filterConditions: {},
    });
  }

  private _initFilterOptionsFromQueryParams(params) {
    this.filterOptions.forEach((filterOption) => {
      if (filterOption.type === FILTER_TYPE.DATETIME) {
        filterOption.value = {
          type: params.dateFilterType,
          title: params.dateFilterTitle,
        };
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

  public _getApplicationDocumentTypeList() {
    const params = this._buildParams();
    this.configDocumentListService
      .getDataApplicationDocumentTypes(params)
      .subscribe((data: any) => {
        this._parseData(data?.result);
        this.getOverviewData(data?.result);
        if (this.filterForm.controls.id?.value) {
          this.expandedElementApplicationDocumentType = data?.result?.items[0];
        }
        this.filterOptions = JSON.parse(JSON.stringify(this.filterOptions));
      });
  }

  getOverviewData(rawData) {
    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant(
          'system.system_config.document_type.total'
        )
    ).value = rawData?.meta?.totalItems;
  }

  triggerDeselectUsers() {
    this.child.triggerDeselectUsers();
  }

  private changeActionSelectAllDocumentTypeTitle(title: string) {
    this.filterOptions.forEach((filterOption) => {
      if (filterOption.controlName === 'applicationDocumentType') {
        filterOption.titleAction =
          title || this.multiLanguageService.instant('filter.select_all');
      }
    });
  }

  public onOutputAction(event) {
    const action = event.action;
    const list = event.selectedList;
    const idArr = list.map((documentTypeId) => documentTypeId.id);
    switch (action) {
      case MULTIPLE_ELEMENT_ACTION_TYPE.DELETE:
        this.deleteMultiplePrompt(idArr);
        break;
      default:
        return;
    }
  }

  public deleteMultiplePrompt(ids) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'system.system_config.document_type.delete_prompt.title'
      ),
      content: this.multiLanguageService.instant(
        'system.system_config.document_type.delete_prompt.content'
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

  public _doMultipleAction(ids, action) {
    if (!ids) {
      return;
    }
    ids.forEach((id) => {
      this._deleteApplicationDocumentTypeById(id);
    });
    setTimeout(() => {
      if (action === MULTIPLE_ELEMENT_ACTION_TYPE.DELETE) {
        this.triggerDeselectUsers();
      }
    }, 2000);
  }

  public refreshContent() {
    setTimeout(() => {
      this.triggerDeselectUsers();
      this._getApplicationDocumentTypeList();
    }, 1500);
  }

  private _deleteApplicationDocumentTypeById(
    applicationDocumentTypeId: string
  ) {
    if (!applicationDocumentTypeId) {
      return;
    }
    this.subManager.add(
      this.configDocumentListService
        .deleteApplicationDocumentType(applicationDocumentTypeId)
        .subscribe((result) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }
          this.notifier.success(
            this.multiLanguageService.instant(
              'system.system_config.document_type.delete_prompt.success'
            )
          );
          this.dataSource.data = this.dataSource.data.filter((element) => {
            return element.id != applicationDocumentTypeId;
          });
        })
    );
  }

  openUpdateDocumentTypeDialog(element: RequiredDocumentGroupEntity) {
    const addGroupDialogRef = this.dialog.open(
      DocumentTypeSaveDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '800px',
        width: '90%',
        data: {
          title: this.multiLanguageService.instant(
            'system.system_config.document_type.update_form_title'
          ),
          element: element,
        },
      }
    );
    this.subManager.add(
      addGroupDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateApplicationDocumentTypeRequest: UpdateDocumentTypeDto = {
            name: result?.data?.name,
            description: result?.data?.description,
            codeName: result?.data?.codeName,
          };
          this._updateApplicationDocumentType(
            element.id,
            updateApplicationDocumentTypeRequest
          );
        }
      })
    );
  }

  onClickBtnAdd(event) {
    const documentSaveDialogRef = this.dialog.open(
      DocumentTypeSaveDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '800px',
        width: '90%',
        data: {
          title: this.multiLanguageService.instant(
            'system.system_config.document_type.add_form_title'
          ),
          applicationDocumentTypeOptions: this.documentTypeList,
        },
      }
    );
    this.subManager.add(
      documentSaveDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let createApplicationDocumentTypeRequest: CreateDocumentTypeDto = {
            name: result?.data?.name,
            description: result?.data?.description,
            codeName: result?.data?.codeName,
          };
          this._createApplicationDocumentType(
            createApplicationDocumentTypeRequest
          );
        }
      })
    );
  }

  public onRefreshTrigger(event) {
    this._getApplicationDocumentTypeList();
  }

  public onTableActionClick(event: TableActionEventModel) {
    console.log('onTableActionClick', event);
    if (event.action === TABLE_ACTION_TYPE.DELETE) {
      this.openDeleteDocumentTypeDialog(event.element);
    } else if (event.action === TABLE_ACTION_TYPE.EDIT) {
      this.openUpdateDocumentTypeDialog(event.element);
    }
  }

  public openDeleteDocumentTypeDialog(element) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'system.system_config.document_type.delete_prompt.title'
      ),
      content: this.multiLanguageService.instant(
        'system.system_config.document_type.delete_prompt.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this._deleteApplicationDocumentTypeById(element?.id);
      }
    });
  }

  private _createApplicationDocumentType(
    createApplicationDocumentTypeRequest: CreateDocumentTypeDto
  ) {
    if (!createApplicationDocumentTypeRequest) {
      return;
    }
    this.subManager.add(
      this.configDocumentListService
        .createApplicationDocumentType(createApplicationDocumentTypeRequest)
        .subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
          this.notifier.success(
            this.multiLanguageService.instant(
              'system.system_config.document_type.add_success'
            )
          );
          this.refreshContent();
        })
    );
  }

  private _updateApplicationDocumentType(
    id: string,
    updateApplicationDocumentTypeRequest: UpdateDocumentTypeDto
  ) {
    if (!updateApplicationDocumentTypeRequest) {
      return;
    }
    this.subManager.add(
      this.configDocumentListService
        .updateApplicationDocumentType(id, updateApplicationDocumentTypeRequest)
        .subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
          this.notifier.success(
            this.multiLanguageService.instant(
              'system.system_config.document_type.update_success'
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

  private async _checkUserPermissions() {
    this.breadcrumbOptions.showBtnAdd =
      await this.permissionsService.hasPermission(
        PermissionConstants.APPLICATION_DOCUMENT_TYPE_PERMISSION.CREATE
      );

    this.userHasPermissions.deleteDocumentType =
      await this.permissionsService.hasPermission(
        PermissionConstants.APPLICATION_DOCUMENT_TYPE_PERMISSION.DELETE
      );

    this.userHasPermissions.updateDocumentType =
      await this.permissionsService.hasPermission(
        PermissionConstants.APPLICATION_DOCUMENT_TYPE_PERMISSION.UPDATE
      );

    this.displaySelectBtn();
    this.displayTableBtn();
  }

  private displaySelectBtn() {
    for (const selectBtn of this.selectButtons) {
      if (
        selectBtn.action === MULTIPLE_ELEMENT_ACTION_TYPE.DELETE &&
        this.userHasPermissions.deleteDocumentType
      ) {
        selectBtn.hidden = false;
      }
    }
  }

  private displayTableBtn() {
    for (const actionBtn of this.actionButtons) {
      switch (actionBtn.action) {
        case TABLE_ACTION_TYPE.EDIT:
          if (this.userHasPermissions.updateDocumentType) {
            actionBtn.hidden = false;
          }
          break;
        case TABLE_ACTION_TYPE.DELETE:
          if (this.userHasPermissions.deleteDocumentType) {
            actionBtn.hidden = false;
          }
          break;
        default:
          break;
      }
    }
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
