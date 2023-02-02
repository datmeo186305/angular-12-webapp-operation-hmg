import { MULTIPLE_ELEMENT_ACTION_TYPE } from '../../../core/common/enum/operator';

export interface MultipleElementActionEventModel {
  /**
   * Type of multiple element action :  'DELETE' | 'LOCK'
   */
  action: MULTIPLE_ELEMENT_ACTION_TYPE;

  /**
   * Selected items
   */
  selectedList: any;
}
