import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  FILTER_ACTION_TYPE,
  FILTER_TYPE,
  MULTIPLE_ELEMENT_ACTION_TYPE,
  QUERY_CONDITION_TYPE,
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
import { FilterActionEventModel } from '../../../../../public/models/filter/filter-action-event.model';
import { BaseManagementLayoutComponent } from '../../../../../share/components';
import { PageEvent } from '@angular/material/paginator/public-api';
import { Sort } from '@angular/material/sort';
import { FilterEventModel } from '../../../../../public/models/filter/filter-event.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../../core/store';
import * as fromActions from '../../../../../core/store';
import * as fromSelectors from '../../../../../core/store/selectors';
import { ConfigDocumentListService } from './config-document-list.service';
import { OverviewItemModel } from '../../../../../public/models/external/overview-item.model';
import * as _ from 'lodash';
import { TableActionButtonModel } from '../../../../../public/models/external/table-action-button.model';
import { TableActionEventModel } from '../../../../../public/models/external/table-action-event.model';
import { ApplicationDocumentSaveDialogComponent } from '../components/application-document-save-dialog/application-document-save-dialog.component';
import {
  CreateDocumentDto,
  RequiredDocumentEntity,
  RequiredDocumentGroupEntity,
  UpdateDocumentDto,
} from '../../../../../../../open-api-modules/monexcore-api-docs';
import { PermissionConstants } from '../../../../../core/common/constants/permission-constants';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-config-document-list',
  templateUrl: './config-document-list.component.html',
  styleUrls: ['./config-document-list.component.scss'],
})
export class ConfigDocumentListComponent implements OnInit, OnDestroy {
  @ViewChild(BaseManagementLayoutComponent)
  child: BaseManagementLayoutComponent;

  tableTitle: string = this.multiLanguageService.instant(
    'system.system_config.application_document.title'
  );
  hasSelect: boolean = true;
  hasActions: boolean = true;
  allColumns: any[] = [
    {
      key: 'name',
      title: this.multiLanguageService.instant(
        'system.system_config.application_document.name'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'documentTypeName',
      title: this.multiLanguageService.instant(
        'system.system_config.application_document.document_type'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'description',
      title: this.multiLanguageService.instant(
        'system.system_config.application_document.description'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
    },
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'system.system_config.application_document.created_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: true,
    },
    {
      key: 'updatedAt',
      title: this.multiLanguageService.instant(
        'system.system_config.application_document.updated_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm',
      showed: false,
    },
    {
      key: 'updatedBy',
      title: this.multiLanguageService.instant(
        'system.system_config.application_document.updated_by'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: false,
    },
  ];
  selectButtons: TableSelectActionModel[] = [
    {
      hidden: false,
      action: MULTIPLE_ELEMENT_ACTION_TYPE.DELETE,
      color: 'accent',
      content: this.multiLanguageService.instant(
        'system.system_config.application_document.delete'
      ),
      imageSrc: 'assets/img/icon/group-5/svg/trash.svg',
      style: 'background-color: #dc3545;',
    },
  ];

  documentTypeList: RequiredDocumentGroupEntity[];
  expandedElementApplicationDocument: RequiredDocumentEntity;
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
    title: this.multiLanguageService.instant('breadcrumb.config_document'),
    iconImgSrc: 'assets/img/icon/group-7/svg/setting-green.svg',
    searchPlaceholder: this.multiLanguageService.instant(
      'breadcrumb.search_field.config_document'
    ),
    searchable: false,
    showBtnAdd: false,
    btnAddText: this.multiLanguageService.instant(
      'system.system_config.application_document.add'
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
    {
      title: this.multiLanguageService.instant(
        'system.system_config.application_document.document_type'
      ),
      type: FILTER_TYPE.SEARCH_SELECT,
      controlName: 'requiredDocumentGroupId',
      value: null,
      showAction: false,
      titleAction: this.multiLanguageService.instant('common.view'),
      actionControlName: 'SELECT_ALL_DOCUMENT_TYPE',
      options: [],
      multiple: true,
      searchPlaceholder: this.multiLanguageService.instant(
        'system.system_config.application_document.search_document_type'
      ),
      emptyResultText: this.multiLanguageService.instant(
        'system.system_config.application_document.empty_document_type'
      ),
    },
  ];

  overviewItems: OverviewItemModel[] = [
    {
      field: this.multiLanguageService.instant(
        'system.system_config.application_document.total'
      ),
      value: 0,
    },
  ];

  actionButtons: TableActionButtonModel[] = [
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

  userHasPermissions = {
    updateDocument: false,
    deleteDocument: false,
    getDocumentType: false,
  };

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
    private configDocumentListService: ConfigDocumentListService,
    private permissionsService: NgxPermissionsService,
    private store: Store<fromStore.State>
  ) {
    this.routeAllState$ = store.select(fromSelectors.getRouterAllState);
    this._initFilterForm();
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromActions.SetOperatorInfo(null));
    this._getApplicationDocumentTypeList();
    setTimeout(() => {
      this._initSubscription();
    }, 1000);
  }

  private _initSubscription() {
    this.subManager.add(
      this.routeAllState$.subscribe((params) => {
        if (params?.url.includes(window.location.pathname)) {
          this._parseQueryParams(params?.queryParams);
          this._getApplicationDocumentList();
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
      if (event.controlName === 'requiredDocumentGroupId') {
        this.handleFilterActionTriggerDocumentTypeId(event);
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
      case FILTER_TYPE.SEARCH_SELECT:
        if (event.controlName === 'requiredDocumentGroupId') {
          this.filterForm.controls.requiredDocumentGroupId?.setValue(
            event.value ? event.value.join(',') : ''
          );
        }
        break;
      case FILTER_TYPE.SELECT:
      case FILTER_TYPE.MULTIPLE_CHOICE:
      default:
        break;
    }
    this._onFilterChange();
  }

  private _initFilterForm() {
    this.filterForm = this.formBuilder.group({
      id: [''],
      keyword: [''],
      requiredDocumentGroupId: [''],
      orderBy: ['createdAt'],
      sortDirection: ['desc'],
      startTime: [null],
      endTime: [null],
      dateFilterType: [''],
      dateFilterTitle: [''],
      filterConditions: {
        requiredDocumentGroupId: QUERY_CONDITION_TYPE.IN,
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
      requiredDocumentGroupId: '',
      orderBy: 'createdAt',
      sortDirection: 'desc',
      startTime: null,
      endTime: null,
      dateFilterType: '',
      dateFilterTitle: '',
      filterConditions: {
        requiredDocumentGroupId: QUERY_CONDITION_TYPE.IN,
      },
    });
  }

  private _initFilterOptionsFromQueryParams(params) {
    this.filterOptions.forEach((filterOption) => {
      if (filterOption.type === FILTER_TYPE.DATETIME) {
        filterOption.value = {
          type: params.dateFilterType,
          title: params.dateFilterTitle,
        };
      } else if (filterOption.controlName === 'requiredDocumentGroupId') {
        filterOption.value = this.filterForm.controls.requiredDocumentGroupId
          .value
          ? this.filterForm.controls.requiredDocumentGroupId.value.split(',')
          : [];
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

  public _getApplicationDocumentList() {
    const params = this._buildParams();
    this.configDocumentListService
      .getDataApplicationDocuments(params)
      .subscribe((data: any) => {
        this._parseData(data?.result);
        this.getOverviewData(data?.result);
        this.dataSource.data = data?.result?.items.map((item: any) => {
          return {
            ...item,
            documentTypeName: this._bindDocumentTypeName(
              item.requiredDocumentGroupId
            ),
          };
        });
        if (this.filterForm.controls.id?.value) {
          this.expandedElementApplicationDocument = data?.result?.items[0];
        }
        this.filterOptions = JSON.parse(JSON.stringify(this.filterOptions));
      });
  }

  private _bindDocumentTypeName(documentGroupId: string) {
    if (!documentGroupId) return null;
    if (!this.documentTypeList) return documentGroupId;
    let filteredDocumentGroup = this.documentTypeList?.find((documentGroup) => {
      return documentGroup.id === documentGroupId;
    });
    if (filteredDocumentGroup) return filteredDocumentGroup.name;
    return documentGroupId;
  }

  getOverviewData(rawData) {
    this.overviewItems.find(
      (ele) =>
        ele.field ===
        this.multiLanguageService.instant(
          'system.system_config.application_document.total'
        )
    ).value = rawData?.meta?.totalItems;
  }

  triggerDeselectUsers() {
    this.child.triggerDeselectUsers();
  }

  handleFilterActionTriggerDocumentTypeId(event: FilterActionEventModel) {
    if (event.actionControlName === 'SELECT_ALL_DOCUMENT_TYPE') {
      this.router.navigateByUrl('/system/product-config/document-type');
    }
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
        'system.system_config.application_document.delete_prompt.title'
      ),
      content: this.multiLanguageService.instant(
        'system.system_config.application_document.delete_prompt.content'
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
      this._deleteApplicationDocumentById(id);
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
      this._getApplicationDocumentList();
    }, 1500);
  }

  private _deleteApplicationDocumentById(applicationDocumentId: string) {
    if (!applicationDocumentId) {
      return;
    }
    this.subManager.add(
      this.configDocumentListService
        .deleteApplicationDocument(applicationDocumentId)
        .subscribe((result) => {
          if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(result?.message),
              result?.errorCode
            );
          }
          this.notifier.success(
            this.multiLanguageService.instant(
              'system.system_config.application_document.delete_prompt.success'
            )
          );
          this.dataSource.data = this.dataSource.data.filter((element) => {
            return element.id != applicationDocumentId;
          });
        })
    );
  }

  openUpdateApplicationDocumentDialog(element: RequiredDocumentEntity) {
    const addGroupDialogRef = this.dialog.open(
      ApplicationDocumentSaveDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '800px',
        width: '90%',
        data: {
          title: this.multiLanguageService.instant(
            'system.system_config.application_document.update_form_title'
          ),
          element: element,
          requiredDocumentGroupIdOptions: this.documentTypeList,
        },
      }
    );
    this.subManager.add(
      addGroupDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateApplicationDocumentRequest: UpdateDocumentDto = {
            isDisplayed: result?.data?.isDisplayed,
            isMandatory: result?.data?.isMandatory,
            name: result?.data?.name,
            description: result?.data?.description,
            requiredDocumentGroupId: result?.data?.requiredDocumentGroupId,
            fileType: result?.data?.fileType.join(','),
          };
          this._updateApplicationDocument(
            element.id,
            updateApplicationDocumentRequest
          );
        }
      })
    );
  }

  onClickBtnAdd(event) {
    const documentSaveDialogRef = this.dialog.open(
      ApplicationDocumentSaveDialogComponent,
      {
        panelClass: 'custom-info-dialog-container',
        maxWidth: '800px',
        width: '90%',
        data: {
          title: this.multiLanguageService.instant(
            'system.system_config.application_document.add_form_title'
          ),
          requiredDocumentGroupIdOptions: this.documentTypeList,
        },
      }
    );
    this.subManager.add(
      documentSaveDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let createApplicationDocumentRequest: CreateDocumentDto = {
            isDisplayed: result?.data?.isDisplayed || false,
            isMandatory: result?.data?.isMandatory || false,
            name: result?.data?.name,
            description: result?.data?.description,
            requiredDocumentGroupId: result?.data?.requiredDocumentGroupId,
            fileType: result?.data?.fileType.join(','),
          };
          this._createApplicationDocument(createApplicationDocumentRequest);
        }
      })
    );
  }

  private _getApplicationDocumentTypeList() {
    this.configDocumentListService
      .getDataApplicationDocumentTypes({
        limit: 100,
        pageIndex: 0,
        orderBy: 'createdAt',
        keyword: '',
      })
      .subscribe((result: any) => {
        if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
          return this.notifier.error(
            JSON.stringify(result?.message),
            result?.errorCode
          );
        }
        this.documentTypeList = result?.result?.items;
        this._initApplicationDocumentTypeOptions();
        this.filterOptions = JSON.parse(JSON.stringify(this.filterOptions));
      });
  }

  private _initApplicationDocumentTypeOptions() {
    this.filterOptions.forEach((filterOption: FilterOptionModel) => {
      if (
        filterOption.controlName !== 'requiredDocumentGroupId' ||
        !this.documentTypeList
      ) {
        return;
      }
      filterOption.options = this.documentTypeList.map(
        (requiredDocumentGroup: RequiredDocumentGroupEntity) => {
          return {
            title: requiredDocumentGroup.name,
            value: requiredDocumentGroup.id,
          };
        }
      );
    });
  }

  public onRefreshTrigger(event) {
    this._getApplicationDocumentList();
  }

  public onTableActionClick(event: TableActionEventModel) {
    console.log('onTableActionClick', event);
    if (event.action === TABLE_ACTION_TYPE.DELETE) {
      this.openDeleteApplicationDocumentDialog(event.element);
    } else if (event.action === TABLE_ACTION_TYPE.EDIT) {
      this.openUpdateApplicationDocumentDialog(event.element);
    }
  }

  public openDeleteApplicationDocumentDialog(element) {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'system.system_config.application_document.delete_prompt.title'
      ),
      content: this.multiLanguageService.instant(
        'system.system_config.application_document.delete_prompt.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this._deleteApplicationDocumentById(element?.id);
      }
    });
  }

  private _createApplicationDocument(createDocumentDto: CreateDocumentDto) {
    if (!createDocumentDto) {
      return;
    }
    this.subManager.add(
      this.configDocumentListService
        .createApplicationDocument(createDocumentDto)
        .subscribe((response) => {
          response.result.id;
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
          this.notifier.success(
            this.multiLanguageService.instant(
              'system.system_config.application_document.add_success'
            )
          );

          this.refreshContent();
        })
    );
  }

  private _updateApplicationDocument(
    id: string,
    updateDocument: UpdateDocumentDto
  ) {
    if (!updateDocument) {
      return;
    }

    this.subManager.add(
      this.configDocumentListService
        .updateApplicationDocument(id, updateDocument)
        .subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
          this.notifier.success(
            this.multiLanguageService.instant(
              'system.system_config.application_document.update_success'
            )
          );
          this.dataSource.data = this.dataSource.data.map((obj) => {
            if (obj.id === id) {
              return {
                ...obj,
                ...response.result,
                documentTypeName: this._bindDocumentTypeName(
                  response?.result?.requiredDocumentGroupId
                ),
              };
            }

            return obj;
          });
        })
    );
  }

  private async _checkUserPermissions() {
    this.breadcrumbOptions.showBtnAdd =
      await this.permissionsService.hasPermission(
        PermissionConstants.APPLICATION_DOCUMENT_PERMISSION.CREATE
      );

    this.userHasPermissions.deleteDocument =
      await this.permissionsService.hasPermission(
        PermissionConstants.APPLICATION_DOCUMENT_PERMISSION.DELETE
      );

    this.userHasPermissions.updateDocument =
      await this.permissionsService.hasPermission(
        PermissionConstants.APPLICATION_DOCUMENT_PERMISSION.UPDATE
      );

    this.userHasPermissions.getDocumentType =
      await this.permissionsService.hasPermission(
        PermissionConstants.APPLICATION_DOCUMENT_TYPE_PERMISSION.GET_LIST
      );

    this.displaySelectBtn();
    this.displayTableBtn();
    this.displayFilterAction();
  }

  private displaySelectBtn() {
    for (const selectBtn of this.selectButtons) {
      if (
        selectBtn.action === MULTIPLE_ELEMENT_ACTION_TYPE.DELETE &&
        this.userHasPermissions.deleteDocument
      ) {
        selectBtn.hidden = false;
      }
    }
  }

  private displayTableBtn() {
    for (const actionBtn of this.actionButtons) {
      switch (actionBtn.action) {
        case TABLE_ACTION_TYPE.EDIT:
          if (this.userHasPermissions.updateDocument) {
            actionBtn.hidden = false;
          }
          break;
        case TABLE_ACTION_TYPE.DELETE:
          if (this.userHasPermissions.deleteDocument) {
            actionBtn.hidden = false;
          }
          break;
        default:
          break;
      }
    }
  }

  private displayFilterAction() {
    for (const filterOption of this.filterOptions) {
      if (
        filterOption.controlName === 'requiredDocumentGroupId' &&
        this.userHasPermissions.getDocumentType
      ) {
        filterOption.showAction = true;
      }
    }
  }
}
