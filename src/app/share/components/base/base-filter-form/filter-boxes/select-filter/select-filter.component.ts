import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FilterOptionModel } from '../../../../../../public/models/filter/filter-option.model';
import { FilterEventModel } from '../../../../../../public/models/filter/filter-event.model';
import { FilterItemModel } from '../../../../../../public/models/filter/filter-item.model';
import {FILTER_ACTION_TYPE} from "../../../../../../core/common/enum/operator";
import {FilterActionEventModel} from "../../../../../../public/models/filter/filter-action-event.model";

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss'],
})
export class SelectFilterComponent implements OnInit {
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

  selectedItems: string[] = [];
  responsive: boolean = false;
  resizeTimeout: any;

  constructor() {}

  ngOnInit(): void {
    this.onResponsiveInverted();
  }

  onResponsiveInverted() {
    this.responsive = window.innerWidth < 768;
  }

  public selectSubItem(item) {
    const index = this.selectedItems.findIndex((ele) => ele === item);
    if (index < 0) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }
  }

  public mobileSelectSubItem(item) {
    this.selectSubItem(item);
    this._completeMultipleFilter();
  }

  get displayTitle() {
    return this._filterOption.options[0].subOptions
      .filter((subOption) => {
        return this.selectedItems.includes(subOption.value);
      })
      .map((subOption) => {
        return subOption.code;
      })
      .join(',');
  }

  public selectSingleItem(item: FilterItemModel) {
    //Single select filter
    if (!this.filterOption.multiple) {
      this._completeSingleFilter(item.value);
      return;
    }


    //Get all
    if (!item.value) {
      this.resetSelectedItem();
      return;
    }

    //Multiple select filter
    this.selectSubItem(item.value);
    this._completeMultipleFilter();
  }

  public _completeMultipleFilter() {
    this.completeFilter.emit({
      type: this.filterOption.type,
      controlName: this.filterOption.controlName,
      value: this.selectedItems,
    });
  }

  private _completeSingleFilter(value) {
    this.selectedItems = [value]
    this.completeFilter.emit({
      type: this.filterOption.type,
      controlName: this.filterOption.controlName,
      value: value,
    });
  }

  public resetSelectedItem() {
    this.selectedItems = [];
    this._completeMultipleFilter();
  }

  public completeSelectSubOptionsFilter(element) {
    element.style.display = 'none';
    this._completeMultipleFilter();
  }

  public displayDetailOption(currentElement) {
    const filterFormList = document.querySelectorAll(
      '.filter-form-container-expand'
    );
    if (window.getComputedStyle(currentElement, null).display == 'none') {
      filterFormList.forEach((ele) => {
        ele.setAttribute('style', 'display:none');
      });
      currentElement.style.display = 'block';
      return;
    }
    filterFormList.forEach((ele) => {
      ele.setAttribute('style', 'display:none');
    });
  }

  public triggerExtraAction(filterItem: FilterOptionModel) {
    this.clickActionBtn.emit({
      type: FILTER_ACTION_TYPE.FILTER_EXTRA_ACTION,
      controlName: this._filterOption.controlName,
      value: filterItem.value,
      actionControlName: filterItem.actionControlName,
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //debounce resize, wait for resize to finish before doing stuff
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.onResponsiveInverted();
    }, 200);
  }
}
