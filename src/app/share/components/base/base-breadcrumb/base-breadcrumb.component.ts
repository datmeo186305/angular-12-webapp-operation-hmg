import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-base-breadcrumb',
  templateUrl: './base-breadcrumb.component.html',
  styleUrls: ['./base-breadcrumb.component.scss'],
})
export class BaseBreadcrumbComponent implements OnInit {
  /**
   * Breadcrumb title
   */
  @Input() title: string;

  /**
   * Class image use sprite-css
   */
  @Input() iconClass: string;

  /**
   * Image src icon
   */
  @Input() iconImgSrc: string;

  /**
   * Search placeholder in search box
   */
  @Input() searchPlaceholder: string;

  /**
   * Searchable: true or false
   *
   * Default is true
   */
  @Input() searchable: boolean = true;

  /**
   * Label of extra action button
   */
  @Input() extraActionLabel: string;

  /**
   * Text of add button
   */
  @Input() btnAddText: string;

  /**
   * Show button add: true or false
   */
  @Input() showBtnAdd: boolean = false;

  /**
   * Max length of search box
   *
   * Default maxLength is 50
   */
  @Input() maxLengthSearchInput: number = 50;

  /**
   * Text of export button
   */
  @Input() btnExportText: string;

  /**
   * Show button export: true or false
   *
   * Default is false
   */
  @Input() showBtnExport: boolean = false;

  /**
   * Value of search box
   */
  _keyword: string;
  @Input()
  get keyword(): string {
    return this._keyword;
  }

  set keyword(value: string) {
    this.searchForm.controls.keyword.setValue(value);
    this._keyword = value;
  }

  /**
   * Trigger when submit search form
   */
  @Output() submitSearchForm = new EventEmitter<string>();

  /**
   * Trigger when click button add
   */
  @Output() clickBtnAdd = new EventEmitter<string>();

  /**
   * Trigger when click button export
   */
  @Output() clickBtnExport = new EventEmitter<string>();

  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {
    this.searchForm = this.formBuilder.group({
      keyword: [''],
    });
  }

  ngOnInit(): void {}

  public resetSearchForm() {
    this.searchForm.reset();
  }

  public submitSearch() {
    const searchData = this.searchForm.getRawValue();
    this.submitSearchForm.emit(searchData);
  }

  public changeInput(data) {
    if (!data) {
      this.submitSearch();
    }
  }

  onClickButtonAdd(event) {
    this.clickBtnAdd.emit(event);
  }

  onClickButtonExport(event) {
    this.clickBtnExport.emit(event);
  }
}
