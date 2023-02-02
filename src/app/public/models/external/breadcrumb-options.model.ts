export interface BreadcrumbOptionsModel {
  /**
   * Title of breadcrumb
   */
  title: string;

  /**
   * Class image use sprite-css
   */
  iconClass?: string;

  /**
   * Image src icon
   */
  iconImgSrc?: string;

  /**
   * Search placeholder in search box
   */
  searchPlaceholder?: string;

  /**
   * Value of search box
   */
  keyword?: string;

  /**
   * Searchable: true or false
   */
  searchable?: boolean;

  /**
   * Max length of search box
   */
  maxLengthSearchInput?: number;

  /**
   * Label of extra action button
   */
  extraActionLabel?: string;

  /**
   * Text of add button
   */
  btnAddText?: string;

  /**
   * Show button add: true or false
   */
  showBtnAdd?: boolean;

  /**
   * Text of export button
   */
  btnExportText?: string;

  /**
   * Show button export: true or false
   */
  showBtnExport?: boolean;
}
