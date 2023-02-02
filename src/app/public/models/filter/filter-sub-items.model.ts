export interface FilterSubItemsModel {
  /**
   * Title of sub item
   */
  title: string;

  /**
   * Value of sub item
   */
  value: string;

  /**
   * Selected: true or false
   */
  selected?: boolean;

  /**
   * Image src
   */
  imgSrc?: string;

  code?: string;

  showAction?: boolean;
}
