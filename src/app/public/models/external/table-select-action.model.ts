import {MULTIPLE_ELEMENT_ACTION_TYPE} from "../../../core/common/enum/operator";

export interface TableSelectActionModel {
  /**
   * Image src
   */
  imageSrc?: string;

  /**
   * Class image use sprite-css
   */
  classImgSrc?: string;

  /**
   * Type of table action 'DELETE' | 'LOCK'
   */
  action: MULTIPLE_ELEMENT_ACTION_TYPE;

  /**
   * Color 'accent' | 'primary'
   */
  color: string;

  /**
   * Content of action button
   */
  content: string;

  /**
   * Style for button
   */
  style?: string;

  /**
   * Hidden button: true or false
   */
  hidden?: boolean;
}
