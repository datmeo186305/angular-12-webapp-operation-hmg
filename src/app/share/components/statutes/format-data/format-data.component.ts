import { Component, Input, OnInit } from '@angular/core';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../core/common/enum/operator';

@Component({
  selector: 'app-format-data',
  templateUrl: './format-data.component.html',
  styleUrls: ['./format-data.component.scss'],
})
export class FormatDataComponent implements OnInit {
  @Input() type: DATA_CELL_TYPE;
  @Input() value: any;
  @Input() externalValue: any;
  @Input() format: string | DATA_STATUS_TYPE;

  constructor() {}

  ngOnInit(): void {}
}
