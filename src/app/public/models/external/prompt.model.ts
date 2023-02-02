export interface Prompt {
  /**
   * Title of prompt
   */
  title: string;

  /**
   * Content of prompt
   */
  content: string;

  /**
   * Disabled button: true or false
   */
  disabledBtn?: boolean;

  /**
   * Image url prompt
   */
  imgUrl?: string;

  /**
   * Class image use sprite-css
   */
  imgGroupUrl?: string;

  /**
   * Text of primary button
   */
  primaryBtnText?: string;

  /**
   * Class of primary button
   */
  primaryBtnClass?: string;

  /**
   * Text of secondary button
   */
  secondaryBtnText?: string;

  /**
   * Class of secondary button
   */
  secondaryBtnClass?: string;

  /**
   * Class background of image
   */
  imgBackgroundClass?: string;
}
