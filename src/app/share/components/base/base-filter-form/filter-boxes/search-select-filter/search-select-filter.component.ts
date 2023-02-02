import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterOptionModel } from '../../../../../../public/models/filter/filter-option.model';
import { FilterEventModel } from '../../../../../../public/models/filter/filter-event.model';
import { FilterActionEventModel } from '../../../../../../public/models/filter/filter-action-event.model';
import { FILTER_ACTION_TYPE } from '../../../../../../core/common/enum/operator';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FilterItemModel } from '../../../../../../public/models/filter/filter-item.model';

@Component({
  selector: 'app-search-select-filter',
  templateUrl: './search-select-filter.component.html',
  styleUrls: ['./search-select-filter.component.scss'],
})
export class SearchSelectFilterComponent implements OnInit {
  _filterOption: FilterOptionModel;
  @Input()
  get filterOption(): FilterOptionModel {
    return this._filterOption;
  }

  set filterOption(filterOptionModel: FilterOptionModel) {
    this._filterOption = filterOptionModel;
    this.searchSelectFilterCtrl.setValue(filterOptionModel.value);
    this.selectedOptions = filterOptionModel.value;
    this.filteredItems = filterOptionModel.options;
  }

  @Output() completeFilter = new EventEmitter<FilterEventModel>();
  @Output() clickActionBtn = new EventEmitter<FilterActionEventModel>();

  searchSelectFilterCtrl: FormControl = new FormControl();
  selectSearchCtrl: FormControl = new FormControl();
  selectedOptions: any;
  _onDestroy = new Subject<void>();
  filteredItems: FilterItemModel[] = [];

  constructor() {}

  ngOnInit(): void {
    this.selectSearchCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSelectOptions();
      });
  }

  filterSelectOptions() {
    let search = this.selectSearchCtrl.value;
    if (!search) {
      this.filteredItems = this._filterOption.options;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredItems = this._filterOption.options.filter(
      (item) => item.title.toLowerCase().indexOf(search) > -1
    );
  }

  public triggerExtraAction(filterItem: FilterOptionModel) {
    this.clickActionBtn.emit({
      type: FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION,
      controlName: this._filterOption.controlName,
      value: filterItem.value,
      actionControlName: filterItem.actionControlName,
    });
  }

  public changeSelectedOption(event) {
    console.log('changeSelectedOption', event);
    if (!event.value) {
      this.selectedOptions = null;
      return;
    }

    this.selectedOptions = event.value;
  }

  public triggerOpenedChangeSelect(isOpened) {
    if (isOpened || this._filterOption.value === this.selectedOptions) {
      return;
    }
    this.completeFilter.emit({
      type: this._filterOption.type,
      controlName: this._filterOption.controlName,
      value: this.selectedOptions,
    });
  }

  public onToggleAll(isToggleAll: boolean, filterItem: FilterOptionModel) {
    this.clickActionBtn.emit({
      type: FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION,
      controlName: this._filterOption.controlName,
      value: isToggleAll,
      actionControlName: filterItem.actionControlName,
    });
  }
}
