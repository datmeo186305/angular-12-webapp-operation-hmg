import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { LoanListService } from '../../../payday-loan/loan-list/loan-list.service';
import { BnplApplication } from '../../../../../../../open-api-modules/bnpl-api-docs';
import { BnplListService } from '../../bnpl-list/bnpl-list.service';

@Component({
  selector: 'app-bnpl-contract',
  templateUrl: './bnpl-contract.component.html',
  styleUrls: ['./bnpl-contract.component.scss'],
})
export class BnplContractComponent implements OnInit {
  loanContractView: any;
  loanContractFile: any;
  subManager = new Subscription();
  downloadable: boolean = false;

  private _loanDetail: BnplApplication;
  @Input()
  get loanDetail(): BnplApplication {
    return this._loanDetail;
  }

  set loanDetail(value: BnplApplication) {
    this._loanDetail = value;
    if (value.id) {
      this.downloadFileContract(value.id);
    }
  }

  constructor(
    private notifier: ToastrService,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private multiLanguageService: MultiLanguageService,
    private loanListService: LoanListService,
    private bnplListService: BnplListService
  ) {}

  ngOnInit(): void {}

  downloadFileContract(loanId) {
    this.subManager.add(
      this.bnplListService.downloadBnplContract(loanId).subscribe((data) => {
        if (!data) return;
        this.downloadable = true;
        this.loanContractFile = data;
        this.pdfView(this.loanContractFile);
      })
    );
  }

  onClickDownload() {
    this.bnplListService.downloadBlobFile(
      this.loanContractFile,
      this._loanDetail?.loanCode
    );
    this.notifier.info(
      this.multiLanguageService.instant('bnpl.loan_contract.downloading')
    );
  }

  pdfView(pdfurl: string) {
    pdfurl += '#toolbar=1&navpanes=0&scrollbar=0&zoom=90';
    this.loanContractView = this.domSanitizer.bypassSecurityTrustHtml(
      "<iframe  src='" +
        pdfurl +
        "' type='application/pdf' style='width:100%; height: 70vh; background-color:white;'>" +
        'Object ' +
        pdfurl +
        ' failed' +
        '</iframe>'
    );
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
}
