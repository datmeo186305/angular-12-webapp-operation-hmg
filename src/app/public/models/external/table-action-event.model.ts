import { TABLE_ACTION_TYPE } from '../../../core/common/enum/operator';

export interface TableActionEventModel {
  /**
   * Data of row trigger action
   */
  element: any;

  /**
   * Type of table action 'VIEW' | 'EDIT' | 'CREATE' | 'DELETE'
   */
  action: TABLE_ACTION_TYPE;
}
