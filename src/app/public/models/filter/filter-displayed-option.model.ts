import { FilterItemModel } from './filter-item.model';

export interface FilterDisplayedOptionModel {
  /**
   * Info of item
   */
  filterItem: FilterItemModel;

  /**
   * Selected item: true or false
   */
  selected?: boolean;
}
