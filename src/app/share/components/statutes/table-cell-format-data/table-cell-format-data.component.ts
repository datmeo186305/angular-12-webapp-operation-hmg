import {Component, Input, OnInit} from '@angular/core';
import {DATA_CELL_TYPE, DATA_STATUS_TYPE} from "../../../../core/common/enum/operator";

@Component({
  selector: 'app-table-cell-format-data',
  templateUrl: './table-cell-format-data.component.html',
  styleUrls: ['./table-cell-format-data.component.scss'],
})
export class TableCellFormatDataComponent implements OnInit {
  @Input() type: DATA_CELL_TYPE;
  @Input() value: any;
  @Input() externalValue: any;
  @Input() externalValue2: any;
  @Input() format: string | DATA_STATUS_TYPE;

  constructor() {}

  ngOnInit(): void {}
}
