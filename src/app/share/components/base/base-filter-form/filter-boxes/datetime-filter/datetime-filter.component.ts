import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import * as moment from 'moment';
import { MultiLanguageService } from '../../../../../translate/multiLanguageService';
import { FilterEventModel } from '../../../../../../public/models/filter/filter-event.model';
import { FilterOptionModel } from '../../../../../../public/models/filter/filter-option.model';
import { FILTER_DATETIME_TYPE } from '../../../../../../core/common/enum/operator';
import * as _ from 'lodash';

@Component({
  selector: 'app-datetime-filter',
  templateUrl: './datetime-filter.component.html',
  styleUrls: ['./datetime-filter.component.scss'],
})
export class DatetimeFilterComponent implements OnInit {
  _filterOption: FilterOptionModel;
  @Input()
  get filterOption(): FilterOptionModel {
    return this._filterOption;
  }

  set filterOption(filterOptionModel: FilterOptionModel) {
    this.selectedTimeFilterMethod = filterOptionModel.value
      ? filterOptionModel.value?.type || FILTER_DATETIME_TYPE.TIME_FRAME
      : FILTER_DATETIME_TYPE.TIME_FRAME;
    this._filterOption = filterOptionModel;
  }

  @Output() completeFilter = new EventEmitter<FilterEventModel>();

  currentTime = new Date();
  currentDate = moment();
  currentQuarter = moment().quarter();
  responsive: boolean = false;
  resizeTimeout: any;

  timeFilterOptions: any = [
    {
      mainTitle: this.multiLanguageService.instant('filter.options.by_day'),
      options: [
        {
          title: this.multiLanguageService.instant('filter.options.to_day'),
          startDate: this.today.startDate,
          endDate: this.today.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.yesterday'),
          startDate: this.yesterday.startDate,
          endDate: this.yesterday.endDate,
        },
      ],
    },
    {
      mainTitle: this.multiLanguageService.instant('filter.options.by_week'),
      options: [
        {
          title: this.multiLanguageService.instant('filter.options.this_week'),
          startDate: this.currentWeek.startDate,
          endDate: this.currentWeek.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.last_week'),
          startDate: this.lastWeek.startDate,
          endDate: this.lastWeek.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.last_7_days'
          ),
          startDate: this.last7days.startDate,
          endDate: this.last7days.endDate,
        },
      ],
    },
    {
      mainTitle: this.multiLanguageService.instant('filter.options.by_month'),
      options: [
        {
          title: this.multiLanguageService.instant('filter.options.this_month'),
          startDate: this.currentMonth.startDate,
          endDate: this.currentMonth.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.last_month'),
          startDate: this.lastMonth.startDate,
          endDate: this.lastMonth.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.last_30_days'
          ),
          startDate: this.last30days.startDate,
          endDate: this.last30days.endDate,
        },
      ],
    },
    {
      mainTitle: this.multiLanguageService.instant(
        'filter.options.by_quarterly'
      ),
      options: [
        {
          title: this.multiLanguageService.instant(
            'filter.options.first_quarterly'
          ),
          startDate: this.firstQuarter.startDate,
          endDate: this.firstQuarter.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.second_quarterly'
          ),
          startDate: this.secondQuarter.startDate,
          endDate: this.secondQuarter.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.third_quarterly'
          ),
          startDate: this.thirdQuarter.startDate,
          endDate: this.thirdQuarter.endDate,
        },
        {
          title: this.multiLanguageService.instant(
            'filter.options.fourth_quarterly'
          ),
          startDate: this.fourthQuarter.startDate,
          endDate: this.fourthQuarter.endDate,
        },
      ],
    },
    {
      mainTitle: this.multiLanguageService.instant('filter.options.by_year'),
      options: [
        {
          title: this.multiLanguageService.instant('filter.options.this_year'),
          startDate: this.currentYear.startDate,
          endDate: this.currentYear.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.last_year'),
          startDate: this.lastYear.startDate,
          endDate: this.lastYear.endDate,
        },
        {
          title: this.multiLanguageService.instant('filter.options.all_time'),
          startDate: null,
          endDate: this.today.endDate,
        },
      ],
    },
  ];

  selectedTimeFilterMethod: FILTER_DATETIME_TYPE;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;

  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {
    this.onResponsiveInverted();
  }

  onResponsiveInverted() {
    this.responsive = window.innerWidth < 768;
  }

  get filterOptionValue() {
    return this.filterOption.value;
  }

  get chosenTimeFrameMethod(): string {
    return this.filterOptionValue &&
      this.filterOptionValue.type === FILTER_DATETIME_TYPE.TIME_FRAME
      ? this.filterOptionValue.title ||
          this.multiLanguageService.instant('filter.all_time')
      : this.multiLanguageService.instant('filter.all_time');
  }

  get chosenTimeRangeMethod(): string {
    return this.filterOptionValue &&
      this.filterOptionValue.type === FILTER_DATETIME_TYPE.TIME_RANGE
      ? this.filterOptionValue.title ||
          this.multiLanguageService.instant('filter.choose_range_time')
      : this.multiLanguageService.instant('filter.choose_range_time');
  }

  public formatTime(time) {
    if (!time) return;
    return new Date(new Date(time).getTime()).toISOString();
  }

  public startDate(time) {
    return this.formatTime(moment(time).set({ h: 0, m: 0, s: 0 }));
  }

  public endDate(time) {
    return this.formatTime(moment(time).set({ h: 23, m: 59, s: 59 }));
  }

  get today() {
    const startDate = this.startDate(moment());
    const endDate = this.endDate(moment());
    return { startDate, endDate };
  }

  get yesterday() {
    const timeOption = moment().subtract(1, 'days');
    const startDate = this.startDate(timeOption);
    const endDate = this.endDate(timeOption);
    return { startDate, endDate };
  }

  get currentWeek() {
    const weekStart = moment().startOf('isoWeek').isoWeekday(2);
    const startDate = this.startDate(weekStart);
    const endDate = this.endDate(moment());
    return { startDate, endDate };
  }

  get lastWeek() {
    const firstDayOfLastWeek = moment()
      .subtract(1, 'weeks')
      .startOf('isoWeek')
      .isoWeekday(2);
    const lastDayOfLastWeek = moment().subtract(1, 'weeks').endOf('isoWeek');
    const startDate = this.startDate(firstDayOfLastWeek);
    const endDate = this.endDate(lastDayOfLastWeek);
    return { startDate, endDate };
  }

  get last7days() {
    const firstDay = moment().subtract(7, 'days');
    const startDate = this.formatTime(firstDay);
    const endDate = this.formatTime(moment());
    return { startDate, endDate };
  }

  get currentMonth() {
    const timeOptionStart = moment().startOf('month').add(1, 'day');
    const startDate = this.startDate(timeOptionStart);
    const endDate = this.endDate(moment());
    return { startDate, endDate };
  }

  get lastMonth() {
    const timeOptionStart = moment().subtract(1, 'months').startOf('month').add(1,'day')
    const timeOptionEnd = moment().subtract(1, 'months').endOf('month');
    const startDate = this.startDate(timeOptionStart);
    const endDate = this.endDate(timeOptionEnd);
    return { startDate, endDate };
  }

  get last30days() {
    const firstDay = moment().subtract(30, 'days');
    const startDate = this.formatTime(firstDay);
    const endDate = this.formatTime(moment());
    return { startDate, endDate };
  }

  get firstQuarter() {
    const firstDayOfQuarter = moment().month(0).startOf('month').add(1, 'day');
    const lastDayOfQuarter = moment().month(2).endOf('month');
    const startDate = this.startDate(firstDayOfQuarter);
    const endDate = this.endDate(lastDayOfQuarter);
    return { startDate, endDate };
  }

  get secondQuarter() {
    // if (this.currentQuarter < 2) {
    //   return;
    // }
    const firstDayOfQuarter = moment().month(3).startOf('month').add(1, 'day');
    const lastDayOfQuarter = moment().month(5).endOf('month');
    const startDate = this.startDate(firstDayOfQuarter);
    const endDate = this.endDate(lastDayOfQuarter);
    return { startDate, endDate };
  }

  get thirdQuarter() {
    // if (this.currentQuarter < 3) {
    //   return;
    // }
    const firstDayOfQuarter = moment().month(6).startOf('month').add(1, 'day');
    const lastDayOfQuarter = moment().month(8).endOf('month');
    const startDate = this.startDate(firstDayOfQuarter);
    const endDate = this.endDate(lastDayOfQuarter);
    return { startDate, endDate };
  }

  get fourthQuarter() {
    // if (this.currentQuarter < 4) {
    //   return;
    // }
    const firstDayOfQuarter = moment().month(9).startOf('month').add(1, 'day');
    const lastDayOfQuarter = moment().month(11).endOf('month');
    const startDate = this.startDate(firstDayOfQuarter);
    const endDate = this.endDate(lastDayOfQuarter);
    return { startDate, endDate };
  }

  get currentYear() {
    const firstDayOfYear = moment().startOf('year').add(1, 'day');
    const startDate = this.startDate(firstDayOfYear);
    const endDate = this.endDate(moment());
    return { startDate, endDate };
  }

  get lastYear() {
    const firstDayOfLastYear = moment()
      .subtract(1, 'year')
      .startOf('year')
      .add(1, 'day');
    const lastDayOfLastYear = moment().subtract(1, 'year').endOf('year');
    const startDate = this.startDate(firstDayOfLastYear);
    const endDate = this.endDate(lastDayOfLastYear);
    return { startDate, endDate };
  }

  public chooseTimeFilter(startDate, endDate, title, element) {
    element.style.display = 'none';
    this.completeFilterDatetime(startDate, endDate, title);
  }

  public completeFilterDatetime(startDate, endDate, title) {
    let dateFormat = this.formatDateBeforeFilter(startDate, endDate);

    this.completeFilter.emit({
      type: this.filterOption.type,
      controlName: this.filterOption.controlName,
      value: {
        startDate: dateFormat.startDate,
        endDate: dateFormat.endDate,
        title: title,
        type: this.selectedTimeFilterMethod,
      },
    });
  }

  public onSelectEndDateMobile(event) {
    this.selectedEndDate = event;
    const selectedTimeShowOnRadioButton = `${this.selectedStartDateDisplay} - ${this.selectedEndDateDisplay}`;
    this.completeFilterDatetime(
      this.selectedStartDate,
      this.selectedEndDate,
      selectedTimeShowOnRadioButton
    );
  }

  public formatDateBeforeFilter(startTime, endTime) {
    let startDate = startTime
      ? new Date(new Date(startTime).getTime() + 25200000).toISOString()
      : null;
    let endDate = endTime
      ? new Date(new Date(endTime).getTime() + 25200000).toISOString()
      : null;

    //If is same day filter between 00:00:00 and 23:59:59
    if (!_.isEmpty(startDate) && !_.isEmpty(endDate) && startDate == endDate) {
      endDate = new Date(
        new Date(endDate).getTime() + 86400000 - 1
      ).toISOString();
    }
    return {
      startDate: startDate,
      endDate: endDate,
    };
  }

  public selectTimeFilterMethod(type) {
    this.selectedTimeFilterMethod = type;
  }

  public displayDetailOption(currentElement, type) {
    this.selectedTimeFilterMethod = type;
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

  get selectedStartDateDisplay() {
    if (!this.selectedStartDate) return;
    return moment(new Date(this.selectedStartDate)).format('DD/MM/YYYY');
  }

  get selectedStartDay() {
    if (!this.selectedStartDate) return;
    const startDay = moment(new Date(this.selectedStartDate))
      .locale('vi')
      .format('dddd');
    return startDay.charAt(0).toUpperCase() + startDay.slice(1);
  }

  get selectedEndDateDisplay() {
    if (!this.selectedEndDate) {
      this.selectedEndDate = new Date();
    }
    return moment(new Date(this.selectedEndDate)).format('DD/MM/YYYY');
  }

  get selectedEndDay() {
    if (!this.selectedEndDate) {
      this.selectedEndDate = new Date();
    }
    const endDay = moment(new Date(this.selectedEndDate))
      .locale('vi')
      .format('dddd');
    return endDay.charAt(0).toUpperCase() + endDay.slice(1);
  }

  public onSelectStartDate(event, currentEle) {
    if (
      new Date(this.selectedStartDate).getTime() != new Date(event).getTime()
    ) {
      this.selectedEndDate = null;
    }

    this.selectedStartDate = event;
  }

  public onSelectEndDate(event, currentEle) {
    this.selectedEndDate = event;
    const selectedTimeShowOnRadioButton = `${this.selectedStartDateDisplay} - ${this.selectedEndDateDisplay}`;
    this.chooseTimeFilter(
      this.selectedStartDate,
      this.selectedEndDate,
      selectedTimeShowOnRadioButton,
      currentEle
    );
  }

  public resetSelectedDate() {
    this.selectedStartDate = null;
    this.selectedEndDate = null;

    this.completeFilter.emit({
      type: this.filterOption.type,
      controlName: this.filterOption.controlName,
      value: {
        startDate: null,
        endDate: null,
        title: null,
        type: this.selectedTimeFilterMethod,
      },
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
