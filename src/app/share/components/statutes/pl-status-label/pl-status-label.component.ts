import { Component, Input, OnInit } from '@angular/core';
import { PL_LABEL_STATUS } from '../../../../core/common/enum/label-status';

@Component({
  selector: 'pl-status-label',
  templateUrl: './pl-status-label.component.html',
  styleUrls: ['./pl-status-label.component.scss'],
})
export class PlStatusLabelComponent implements OnInit {
  statusClasses: string;
  _statusType: PL_LABEL_STATUS | string = PL_LABEL_STATUS.SUCCESS;

  @Input()
  get statusType(): PL_LABEL_STATUS | string {
    return this._statusType;
  }

  set statusType(value: PL_LABEL_STATUS | string) {
    this._statusType = value;
    this.statusClasses = this.initStatusClasses();
  }

  constructor() {}

  ngOnInit(): void {}

  public initStatusClasses() {
    switch (this.statusType) {
      case PL_LABEL_STATUS.INITIALIZED:
        return 'pl-status-label-initialized';
      case PL_LABEL_STATUS.DOCUMENT_AWAITING:
        return 'pl-status-label-document-awaiting';
      case PL_LABEL_STATUS.DOCUMENTATION_COMPLETE:
        return 'pl-status-label-document-complete';
      case PL_LABEL_STATUS.AUCTION:
        return 'pl-status-label-auction';
      case PL_LABEL_STATUS.FUNDED:
        return 'pl-status-label-funded';
      case PL_LABEL_STATUS.CONTRACT_AWAITING:
        return 'pl-status-label-contract-awaiting';
      case PL_LABEL_STATUS.CONTRACT_ACCEPTED:
        return 'pl-status-label-contract-accepted';
      case PL_LABEL_STATUS.AWAITING_DISBURSEMENT:
        return 'pl-status-label-awaiting-disbursement';
      case PL_LABEL_STATUS.DISBURSED:
        return 'pl-status-label-disbursed';
      case PL_LABEL_STATUS.IN_REPAYMENT:
        return 'pl-status-label-in-repayment';
      case PL_LABEL_STATUS.COMPLETED:
        return 'pl-status-label-completed';
      case PL_LABEL_STATUS.REJECTED:
        return 'pl-status-label-rejected';
      case PL_LABEL_STATUS.WITHDRAW:
        return 'pl-status-label-withdraw';
      case PL_LABEL_STATUS.PENDING:
        return 'pl-status-label-pending';
      case PL_LABEL_STATUS.SUCCESS:
        return 'pl-status-label-success';
      case PL_LABEL_STATUS.DISBURSEMENT:
        return 'pl-status-label-disbursement';
      case PL_LABEL_STATUS.REJECT:
        return 'pl-status-label-rejected2';
      case PL_LABEL_STATUS.CANCEL:
        return 'pl-status-label-cancel';
      case PL_LABEL_STATUS.WORSE:
        return 'pl-status-label-worse';
      case PL_LABEL_STATUS.INFO:
        return 'pl-status-label-info';
      default:
        return '';
    }
  }
}
