import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProductRoutes } from './product-routing.module';
import { FormsModule } from '@angular/forms';
import { VerifyOtpFormComponent } from './payday-loan/components/verify-otp-form/verify-otp-form.component';
import { EkycUploadComponent } from './payday-loan/components/ekyc-upload/ekyc-upload.component';
import { ImageUploadAreaComponent } from './payday-loan/components/image-upload-area/image-upload-area.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoanListComponent } from './payday-loan/loan-list/loan-list.component';
import { LoanDetailComponent } from './payday-loan/components/loan-detail/loan-detail.component';
import { LoanContractComponent } from './payday-loan/components/loan-contract/loan-contract.component';
import { LoanRatingComponent } from './payday-loan/components/loan-rating/loan-rating.component';
import { LoanDetailInfoComponent } from './payday-loan/components/loan-detail-info/loan-detail-info.component';
import { LoanNoteComponent } from './payday-loan/components/loan-note/loan-note.component';
import { InfoVerificationComponent } from './payday-loan/components/info-verification/info-verification.component';
import { CompareInfoVerificationComponent } from './payday-loan/components/compare-info-verification/compare-info-verification.component';
import { BnplListComponent } from './bnpl/bnpl-list/bnpl-list.component';
import { BnplElementComponent } from './bnpl/components/bnpl-element/bnpl-element.component';
import { BnplDetailInfoComponent } from './bnpl/components/bnpl-detail-info/bnpl-detail-info.component';
import { BnplRepaymentTransactionComponent } from './bnpl/components/bnpl-repayment-transaction/bnpl-repayment-transaction.component';
import { BnplContractComponent } from './bnpl/components/bnpl-contract/bnpl-contract.component';
import { BnplNoteComponent } from './bnpl/components/bnpl-note/bnpl-note.component';
import { BnplPaymentDialogComponent } from './bnpl/components/bnpl-payment-dialog/bnpl-payment-dialog.component';

@NgModule({
  declarations: [
    VerifyOtpFormComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
    LoanListComponent,
    LoanDetailComponent,
    LoanContractComponent,
    LoanRatingComponent,
    LoanDetailInfoComponent,
    LoanNoteComponent,
    InfoVerificationComponent,
    CompareInfoVerificationComponent,
    BnplListComponent,
    BnplElementComponent,
    BnplDetailInfoComponent,
    BnplRepaymentTransactionComponent,
    BnplContractComponent,
    BnplNoteComponent,
    BnplPaymentDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
  ],
  exports: [
    VerifyOtpFormComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
  ],
})
export class ProductModule {}
