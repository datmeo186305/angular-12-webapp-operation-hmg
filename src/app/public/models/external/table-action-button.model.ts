import {TABLE_ACTION_TYPE} from "../../../core/common/enum/operator";

export interface TableActionButtonModel {
  /**
   * Image src
   */
  imageSrc?: string;

  /**
   * Class image use sprite-css
   */
  classImgSrc?: string;

  /**
   * Type of table action 'VIEW' | 'EDIT' | 'CREATE' | 'DELETE'
   */
  action: TABLE_ACTION_TYPE;

  /**
   * Color 'accent' | 'primary'
   */
  color: string;

  /**
   * Content of action button
   */
  content?: string;

  /**
   * Text tooltip of action button
   */
  tooltip?: string;

  /**
   * Style for button
   */
  style?: string;

  /**
   * Hidden button: true or false
   */
  hidden?: boolean;
}
