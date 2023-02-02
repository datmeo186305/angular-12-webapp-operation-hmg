import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FilterOptionModel } from '../../../../public/models/filter/filter-option.model';
import { FilterEventModel } from '../../../../public/models/filter/filter-event.model';
import { FilterActionEventModel } from '../../../../public/models/filter/filter-action-event.model';

@Component({
  selector: 'app-base-filter-form',
  templateUrl: './base-filter-form.component.html',
  styleUrls: ['./base-filter-form.component.scss'],
})
export class BaseFilterFormComponent implements OnInit {
  /**
   * List filter option
   */
  _filterOptions: FilterOptionModel[];
  @Input() get filterOptions(): FilterOptionModel[] {
    return this._filterOptions;
  }
  set filterOptions(value) {
    this._filterOptions = value;
  }

  /**
   * Trigger when change filter
   */
  @Output() triggerFilterChange = new EventEmitter<FilterEventModel>();

  /**
   * Trigger when click action of filter
   */
  @Output() triggerFilterAction = new EventEmitter<FilterActionEventModel>();

  /**
   * Check is desktop or mobile view
   */
  responsive: boolean = false;

  resizeTimeout: any;
  panelOpenState = false;

  constructor() {}

  ngOnInit(): void {
    this.onResponsiveInverted();
  }

  onResponsiveInverted() {
    this.responsive = window.innerWidth < 768;
  }

  completeFilter(event: FilterEventModel) {
    this.triggerFilterChange.emit(event);
  }

  clickActionBtn(event: FilterActionEventModel) {
    this.triggerFilterAction.emit(event);
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
