import { NAV_ITEM } from '../../../core/common/enum/operator';
import { SubmenuItemModel } from './submenu-item.model';

export interface MenuItemModel {
  /**
   * Control name of nav item
   */
  navItem: NAV_ITEM;

  /**
   * Title of menu item
   */
  title: string;

  /**
   * Class image use sprite-css for inactive icon
   */
  defaultIconClass?: string;

  /**
   * Class image use sprite-css for active icon
   */
  activeIconClass?: string;

  /**
   * List permission can show this menu item
   */
  canActivate?: string[];

  /**
   * Sub items of this menu items
   */
  subItems?: SubmenuItemModel[];

  /**
   * Path navigation
   */
  path?: string;

  /**
   * Query params for path navigation
   */
  queryParams?: any;
}
