import { FILTER_TYPE } from 'src/app/core/common/enum/operator';
import { FilterItemModel } from './filter-item.model';

export interface FilterOptionModel {

  /**
   * Title of filter
   */
  title: string;

  /**
   * Type of filter 'SELECT' | 'MULTIPLE_CHOICE' | 'DATETIME' | 'SEARCH_SELECT' ...
   */
  type: FILTER_TYPE;

  /**
   * controlName of filter
   */
  controlName: string;

  /**
   * Value of filter
   */
  value: any;

  /**
   * Can filter multiple option? : true or false
   */
  multiple?: boolean;

  /**
   * Title of action
   */
  titleAction?: string;

  /**
   * controlName of action
   */
  actionControlName?: any;

  /**
   * Class image use sprite-css of action
   */
  actionIconClass?: string;

  /**
   * Show extra action of the filter
   */
  showAction?: boolean;

  /**
   * Show icon extra action
   */
  showIconAction?: boolean;

  /**
   * Hidden the filter
   */
  hidden?: boolean;

  /**
   * Show toggle all checkbox for type 'SEARCH_SELECT'
   */
  showToggleAllCheckbox?: boolean;

  /**
   * Filter item options
   */
  options?: FilterItemModel[];

  /**
   * Search placeholder for type 'SEARCH_SELECT'
   */
  searchPlaceholder?: string;

  /**
   * Empty result text for type 'SEARCH_SELECT'
   */
  emptyResultText?: string;
}
