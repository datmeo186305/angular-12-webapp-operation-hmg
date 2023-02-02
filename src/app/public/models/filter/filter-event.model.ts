import { FILTER_TYPE } from 'src/app/core/common/enum/operator';

export interface FilterEventModel {
  /**
   * Type of filter 'SELECT' | 'MULTIPLE_CHOICE' | 'DATETIME' | 'SEARCH_SELECT' ...
   */
  type: FILTER_TYPE;

  /**
   * Control name
   */
  controlName: string;

  /**
   * Value of filter
   */
  value: any;
}
