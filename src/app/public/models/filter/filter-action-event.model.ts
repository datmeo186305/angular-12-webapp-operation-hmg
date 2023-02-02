import { FILTER_ACTION_TYPE } from 'src/app/core/common/enum/operator';

export interface FilterActionEventModel {
  /**
   * type of filter action 'ITEM_ACTION' | 'FILTER_EXTRA_ACTION' | 'SUB_ITEM_ACTION'
   */
  type: FILTER_ACTION_TYPE;

  /**
   * Control name / Field name
   */
  controlName: string;

  /**
   * Value of action emit
   */
  value: any;

  /**
   * Name of action
   */
  actionControlName?: any;
}
