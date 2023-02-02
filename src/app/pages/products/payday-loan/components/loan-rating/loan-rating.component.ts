import { PaydayLoanHmg } from './../../../../../../../open-api-modules/dashboard-api-docs/model/paydayLoanHmg';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { Component, Input, OnInit } from '@angular/core';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from 'src/app/core/common/enum/operator';
import { PaydayLoanTng } from '../../../../../../../open-api-modules/dashboard-api-docs';

@Component({
  selector: 'app-loan-rating',
  templateUrl: './loan-rating.component.html',
  styleUrls: ['./loan-rating.component.scss'],
})
export class LoanRatingComponent implements OnInit {
  _loanId: string;
  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }

  _loanDetail: PaydayLoanTng | PaydayLoanHmg;
  @Input()
  get loanDetail(): PaydayLoanTng | PaydayLoanHmg {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanTng | PaydayLoanHmg) {
    this._loanDetail = value;
    this.getRating();
    this.getCustomerOpinion();
  }

  middleColumn: any = [
    {
      title: this.multiLanguageService.instant(
        'loan_app.rating.customer_rating'
      ),
      value: '',
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_RATING_STATUS,
    },
    {
      title: this.multiLanguageService.instant('loan_app.rating.comment'),
      value: '',
      type: DATA_CELL_TYPE.TEXT,
      format: null,
    },
    {
      title: this.multiLanguageService.instant('loan_app.rating.other_comment'),
      value: '',
      type: DATA_CELL_TYPE.TEXT,
      format: null,
    },
  ];

  fastOpinionsArray = [
    'Giải ngân nhanh chóng',
    'Quy trình đơn giản',
    'Nhân viên tư vấn nhiệt tình',
    'Mức phí hợp lý',
    'Quy trình, thủ tục',
    'Mức phí của sản phẩm',
    'Chăm sóc khách hàng',
    'Giao diện của sản phẩm',
  ];

  customerOpinionsArray: string[] = [];
  customerOtherOpinion: string = '';
  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {}

  getRating() {
    return this.loanDetail?.ratingInfo?.rate;
  }

  getCustomerOpinion() {
    if (!this.loanDetail?.ratingInfo?.customerOpinion) {
      this.customerOpinionsArray = ['N/A'];
      this.customerOtherOpinion = 'N/A';
      return;
    }
    const fastOpinions =
      this.loanDetail?.ratingInfo?.customerOpinion.split('.');
    const otherOpinion = [];
    for (let i = 0; i < fastOpinions.length; i++) {
      const fastOpinion = fastOpinions[i];
      if (this.fastOpinionsArray.includes(fastOpinion.trim())) {
        this.customerOpinionsArray.push(fastOpinion);
      } else {
        otherOpinion.push(fastOpinion);
      }
    }
    this.customerOtherOpinion = otherOpinion.join('. ');
    return;
  }
}
