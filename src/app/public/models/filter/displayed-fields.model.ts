import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../core/common/enum/operator';

export interface DisplayedFieldsModel {
  /**
   *  Key of main field to display
   *
   *  Support nested field
   *
   *  Example: 'createdAt' | 'customerInfo.name' | 'customerInfo.financialData.accountNumber'
   */
  key: string;

  /**
   * Key of external field
   *
   * Support nested field
   *
   * Example: 'createdAt' | 'customerInfo.name' | 'customerInfo.financialData.accountNumber'
   */
  externalKey?: string;

  /**
   * Key of external field 2
   *
   * Support nested field 2
   *
   * Example: 'createdAt' | 'customerInfo.name' | 'customerInfo.financialData.accountNumber'
   */
  externalKey2?: string;

  /**
   * Title of column
   */
  title: string;

  /**
   * Width of column
   *
   * Default width of column is 100
   */
  width?: number;

  /**
   * Type of display column data 'TEXT' | 'NUMBER' | 'HYPERLINK' | 'DATETIME' | 'STATUS' | 'BOOLEAN' ...
   */
  type?: DATA_CELL_TYPE;

  /**
   * Format data
   *
   * Example 1: 'dd/MM/yyyy HH:mm:ss' for DATA_CELL_TYPE.DATETIME
   *
   * Example 2: 'GPAY_REPAYMENT_STATUS' for DATA_CELL_TYPE.STATUS
   */
  format?: DATA_STATUS_TYPE | string;

  /**
   * Show column: true or false
   */
  showed?: boolean;
}
