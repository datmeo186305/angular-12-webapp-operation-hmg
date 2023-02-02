import { FilterSubItemsModel } from './filter-sub-items.model';

export interface FilterItemModel {
  /**
   * Title of filter item
   */
  title: string;

  note?: string;

  /**
   * Id of filter item
   */
  id?: string;

  /**
   * Value of this filter
   */
  value: any;

  /**
   * Show action: true or false
   */
  showAction?: boolean;

  /**
   * Title of action
   */
  actionTitle?: string;

  /**
   * Class image use sprite-css of action
   */
  actionIconClass?: string;

  /**
   * Control name of action
   */
  actionControlName?: string;

  /**
   * List of sub options of this item
   */
  subOptions?: FilterSubItemsModel[];

  /**
   * Title of the subOptions
   */
  subTitle?: string;

  /**
   * Disable this item: true or false
   */
  disabled?: boolean;

  /**
   * Hidden this item: true or false
   */
  hidden?: boolean;

  /**
   * Count elements of this filter item
   */
  count?: number;
}
