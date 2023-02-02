export interface SubmenuItemModel {
  /**
   * Title of submenu item
   */
  title: string;

  /**
   * Class image use sprite-css
   */
  iconClass?: string;

  /**
   * Path navigation
   */
  path?: string;

  /**
   * Query params for path navigation
   */
  queryParams?: any;

  /**
   * List permission can show this submenu item
   */
  canActivate?: string[];
}
