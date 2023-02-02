import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BreadcrumbOptionsModel } from '../../../../public/models/external/breadcrumb-options.model';
import { SortDirection } from '@angular/material/sort/sort-direction';
import { FilterOptionModel } from '../../../../public/models/filter/filter-option.model';
import { FilterEventModel } from '../../../../public/models/filter/filter-event.model';
import { FilterActionEventModel } from '../../../../public/models/filter/filter-action-event.model';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator/public-api';
import { TableSelectActionModel } from '../../../../public/models/external/table-select-action.model';
import { BaseExpandedTableComponent } from '../base-expanded-table/base-expanded-table.component';
import { OverviewItemModel } from 'src/app/public/models/external/overview-item.model';
import { TableActionButtonModel } from '../../../../public/models/external/table-action-button.model';
import { TableActionEventModel } from '../../../../public/models/external/table-action-event.model';
import { MultipleElementActionEventModel } from '../../../../public/models/filter/multiple-element-action-event.model';
import { DisplayedFieldsModel } from '../../../../public/models/filter/displayed-fields.model';

@Component({
  selector: 'app-base-management-layout',
  templateUrl: './base-management-layout.component.html',
  styleUrls: ['./base-management-layout.component.scss'],
})
export class BaseManagementLayoutComponent implements OnInit {
  /**
   * Template of detail element
   */
  @Input() detailElementTemplate: TemplateRef<any>;

  /**
   * List of columns can display in mat-table
   */
  @Input() allColumns: DisplayedFieldsModel[] = [];
  /**
   *
   * Table title
   */
  @Input() tableTitle: string;

  /**
   * Data source of mat-table
   */
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  /**
   * Number of elements in a page
   *
   * Default the pageSize is 10
   */
  @Input() pageSize: number = 10;

  /**
   * Current page index
   *
   * Default the pageIndex is 0
   */
  @Input() pageIndex: number = 0;

  /**
   * Page size options - Number of elements in a page.
   *
   * Default the pageSizeOptions is [10, 20, 50]
   */
  @Input() pageSizeOptions: number[] = [10, 20, 50];

  /**
   * Total items
   *
   * Default the totalItems is 0
   */
  @Input() totalItems: number = 0;

  /**
   * Total pages
   *
   * Default the pageLength is 0
   */
  @Input() pageLength: number = 0;

  /**
   * The field name table order by
   */
  @Input() orderBy: string;

  /**
   * Display checkbox button in every row of table: true or false
   */
  @Input() hasSelect: boolean;

  /**
   * Display table actions : true or false
   */
  @Input() hasActions: boolean;

  /**
   * Show refresh button: true or false
   */
  @Input() showRefreshBtn: boolean;

  /**
   * Expanded element default
   */
  @Input() forceExpandElement: any;

  /**
   * Sort direction: desc (descending) or asc (ascending)
   *
   * Default the sortDirection is desc
   */
  @Input() sortDirection: SortDirection = 'desc';

  /**
   * List actions for selected rows
   */
  @Input() selectButtons: TableSelectActionModel[] = [];

  /**
   * List actions in every row of table
   */
  @Input() actionButtons: TableActionButtonModel[] = [];

  /**
   * List overview infos in top of table
   */
  @Input() overviewItems: OverviewItemModel[];

  /**
   * Trigger when refresh button is clicked
   */
  @Output() onRefreshTrigger = new EventEmitter<any>();

  /**
   * Trigger when paginator change
   */
  @Output() onPageChange = new EventEmitter<PageEvent>();

  /**
   * Trigger when click sort by any field
   */
  @Output() onSortChange = new EventEmitter<Sort>();

  /**
   * Trigger when click expand any row of table
   */
  @Output() onExpandElementChange = new EventEmitter<any>();

  /**
   * Trigger when click button add
   */
  @Output() onClickBtnAdd = new EventEmitter<any>();

  /**
   * Trigger when click button export
   */
  @Output() onClickBtnExport = new EventEmitter<any>();

  /**
   * Trigger when submit search form
   */
  @Output() onSubmitSearchForm = new EventEmitter<any>();

  /**
   * Trigger when change filter
   */
  @Output() onFilterChange = new EventEmitter<FilterEventModel>();

  /**
   * Trigger when click action of filter
   */
  @Output() onFilterActionTrigger = new EventEmitter<FilterActionEventModel>();

  /**
   * Trigger when any multiple element action is clicked
   */
  @Output() onOutputAction = new EventEmitter<any>();

  /**
   * Trigger when table action is clicked
   */
  @Output() onTableActionClick = new EventEmitter<any>();

  /**
   * List filter option
   */
  _filterOptions: FilterOptionModel[] = [];
  @Input() get filterOptions(): FilterOptionModel[] {
    return this._filterOptions;
  }

  set filterOptions(value) {
    this._filterOptions = value;
  }

  /**
   * Breadcrumb options
   */
  _breadcrumbOptions: BreadcrumbOptionsModel;

  @Input() get breadcrumbOptions(): BreadcrumbOptionsModel {
    return this._breadcrumbOptions;
  }

  set breadcrumbOptions(value) {
    this._breadcrumbOptions = value;
  }

  @ViewChild(BaseExpandedTableComponent) child: BaseExpandedTableComponent;

  constructor() {}

  ngOnInit(): void {}

  triggerDeselectUsers() {
    this.child.deselectAll();
  }

  clickBtnAdd(event) {
    this.onClickBtnAdd.emit(event);
  }

  clickBtnExport(event) {
    this.onClickBtnExport.emit(event);
  }

  submitSearchForm(event) {
    this.onSubmitSearchForm.emit(event);
  }

  triggerRefresh(event) {
    this.onRefreshTrigger.emit(event);
  }

  triggerPageChange(event: PageEvent) {
    this.onPageChange.emit(event);
  }

  triggerSortChange(event: Sort) {
    this.onSortChange.emit(event);
  }

  triggerExpandElementChange(event) {
    this.onExpandElementChange.emit(event);
  }

  triggerFilterChange(event: FilterEventModel) {
    this.onFilterChange.emit(event);
  }

  triggerFilterAction(event: FilterActionEventModel) {
    this.onFilterActionTrigger.emit(event);
  }

  triggerMultipleElementAction(event: MultipleElementActionEventModel) {
    this.onOutputAction.emit(event);
  }

  triggerTableActionClick(event: TableActionEventModel) {
    this.onTableActionClick.emit(event);
  }
}
