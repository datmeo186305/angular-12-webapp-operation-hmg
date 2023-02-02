import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterEventModel } from '../../../../../../public/models/filter/filter-event.model';
import { FilterActionEventModel } from '../../../../../../public/models/filter/filter-action-event.model';
import { FilterOptionModel } from '../../../../../../public/models/filter/filter-option.model';
import { FILTER_ACTION_TYPE } from '../../../../../../core/common/enum/operator';
import { FilterItemModel } from '../../../../../../public/models/filter/filter-item.model';
import { FilterDisplayedOptionModel } from '../../../../../../public/models/filter/filter-displayed-option.model';

@Component({
  selector: 'app-multiple-choice-filter',
  templateUrl: './multiple-choice-filter.component.html',
  styleUrls: ['./multiple-choice-filter.component.scss'],
})
export class MultipleChoiceFilterComponent implements OnInit {
  _filterOption: FilterOptionModel;
  @Input()
  get filterOption(): FilterOptionModel {
    return this._filterOption;
  }

  set filterOption(filterOptionModel: FilterOptionModel) {
    this.selectedItems = filterOptionModel.value || [];
    this._filterOption = filterOptionModel;
  }

  @Output() completeFilter = new EventEmitter<FilterEventModel>();
  @Output() clickActionBtn = new EventEmitter<FilterActionEventModel>();

  selectedItems: FilterDisplayedOptionModel[];

  get chosenItems() {
    let selectedOptions =
      this.selectedItems.filter(
        (element: FilterDisplayedOptionModel) => element.selected === true
      ) || [];

    return selectedOptions.map(
      (ele: FilterDisplayedOptionModel) => ele.filterItem.value
    );
  }

  constructor() {}

  ngOnInit(): void {
    this._initSelectedItems();
  }

  private _initSelectedItems() {
    this.selectedItems = this.filterOption.options.map(
      (item: FilterItemModel) => {
        return {
          filterItem: item,
          selected:
            this.filterOption.value &&
            this.filterOption.value.includes(item.value),
        };
      }
    );
  }

  public filterChange(event, selectedItem: FilterDisplayedOptionModel) {
    selectedItem.selected = !selectedItem.selected;
    this.completeFilter.emit({
      type: this.filterOption.type,
      controlName: this.filterOption.controlName,
      value: this.chosenItems,
    });
  }

  public triggerExtraAction(filterItem: FilterOptionModel) {
    this.clickActionBtn.emit({
      type: FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION,
      controlName: this.filterOption.controlName,
      value: filterItem.value,
      actionControlName: filterItem.actionControlName,
    });
  }

  public triggerItemAction(filterItem: FilterItemModel) {
    this.clickActionBtn.emit({
      type: FILTER_ACTION_TYPE.ITEM_ACTION,
      controlName: this.filterOption.controlName,
      value: filterItem.value,
      actionControlName: filterItem.actionControlName,
    });
  }
}
