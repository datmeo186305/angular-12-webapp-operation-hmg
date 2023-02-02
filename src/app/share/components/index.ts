import { ConfirmationDialog } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { PlPromptComponent } from './dialogs/pl-prompt/pl-prompt.component';
import { OtpInputComponent } from './inputs/otp-input/otp-input.component';
import { SingleOtpInputComponent } from './inputs/single-otp-input/single-otp-input.component';
import { PlLoadingComponent } from './dialogs/pl-loading/pl-loading.component';
import { BaseManagementLayoutComponent } from './base/base-management-layout/base-management-layout.component';
import { BaseFilterFormComponent } from './base/base-filter-form/base-filter-form.component';
import { BaseExpandedTableComponent } from './base/base-expanded-table/base-expanded-table.component';
import { BaseBreadcrumbComponent } from './base/base-breadcrumb/base-breadcrumb.component';
import { PlInlineMessageComponent } from './statutes/pl-inline-message/pl-inline-message.component';
import { PlStatusLabelComponent } from './statutes/pl-status-label/pl-status-label.component';
import { DocumentButtonComponent } from './button/document-button/document-button.component';
import { UploadDocumentAreaComponent } from './upload-area/upload-document-area/upload-document-area.component';
import { PlStatusElementComponent } from './statutes/pl-status-element/pl-status-element.component';
import { FormatDataComponent } from './statutes/format-data/format-data.component';
import { DatetimeFilterComponent } from './base/base-filter-form/filter-boxes/datetime-filter/datetime-filter.component';
import { MultipleChoiceFilterComponent } from './base/base-filter-form/filter-boxes/multiple-choice-filter/multiple-choice-filter.component';
import { SelectFilterComponent } from './base/base-filter-form/filter-boxes/select-filter/select-filter.component';
import { CustomerDocumentInfoComponent } from './operators/customer/customer-document-info/customer-document-info.component';
import { CustomerCompanyInfoComponent } from './operators/customer/customer-company-info/customer-company-info.component';
import { DialogCompanyInfoUpdateComponent } from './operators/customer/dialog-company-info-update/dialog-company-info-update.component';
import { TableCellFormatDataComponent } from './statutes/table-cell-format-data/table-cell-format-data.component';
import { FullsizeImageDialogComponent } from './dialogs/fullsize-image-dialog/fullsize-image-dialog.component';
import { PermissionTreeComponent } from './operators/user-account/permission-tree/permission-tree.component';
import { EditRoleDialogComponent } from './operators/user-account/edit-role-dialog/edit-role-dialog.component';
import { AddNewUserDialogComponent } from './operators/user-account/add-new-user-dialog/add-new-user-dialog.component';
import { DialogUserInfoUpdateComponent } from './operators/user-account/dialog-user-info-update/dialog-user-info-update.component';
import { MerchantDetailDialogComponent } from './operators/merchant/merchant-detail-dialog/merchant-detail-dialog.component';
import { MerchantGroupDialogComponent } from './operators/merchant/merchant-group-dialog/merchant-group-dialog.component';
import { ChangeUserPasswordDialogComponent } from './operators/user-account/change-user-password-dialog/change-user-password-dialog.component';
import { AddNewPdDialogComponent } from './operators/pd-system/add-new-pd-dialog/add-new-pd-dialog.component';
import { AddNewQuestionComponent } from './operators/pd-system/add-new-question/add-new-question.component';
import { DialogEkycInfoDetailComponent } from './operators/customer/dialog-ekyc-info-detail/dialog-ekyc-info-detail.component';
import { PlCheckElementComponent } from './statutes/pl-check-element/pl-check-element.component';
import { MerchantImageUploadComponent } from './operators/merchant/merchant-image-upload/merchant-image-upload.component';
import { MonexLoadingComponent } from './loading/monex-loading/monex-loading.component';
import { ProductStatusDialogComponent } from './operators/product-config/product-status-dialog/product-status-dialog.component';
import { ProductWorkflowDialogComponent } from './operators/product-config/product-workflow-dialog/product-workflow-dialog.component';
import { MonexProductDialogComponent } from './operators/product-config/monex-product-dialog/monex-product-dialog.component';
import { SearchSelectFilterComponent } from './base/base-filter-form/filter-boxes/search-select-filter/search-select-filter.component';
import { MerchantQrCodeDialogComponent } from './operators/merchant/merchant-qr-code-dialog/merchant-qr-code-dialog.component';

export const components: any[] = [
  ConfirmationDialog,
  ShowErrorsComponent,
  OtpInputComponent,
  SingleOtpInputComponent,
  PlPromptComponent,
  PlLoadingComponent,
  PlInlineMessageComponent,
  PlStatusLabelComponent,
  BaseManagementLayoutComponent,
  BaseFilterFormComponent,
  BaseExpandedTableComponent,
  BaseBreadcrumbComponent,
  DocumentButtonComponent,
  UploadDocumentAreaComponent,
  PlStatusElementComponent,
  FormatDataComponent,
  DatetimeFilterComponent,
  MultipleChoiceFilterComponent,
  SelectFilterComponent,
  CustomerDocumentInfoComponent,
  CustomerCompanyInfoComponent,
  DialogCompanyInfoUpdateComponent,
  TableCellFormatDataComponent,
  FullsizeImageDialogComponent,
  PermissionTreeComponent,
  EditRoleDialogComponent,
  AddNewUserDialogComponent,
  DialogUserInfoUpdateComponent,
  MerchantDetailDialogComponent,
  MerchantGroupDialogComponent,
  ChangeUserPasswordDialogComponent,
  AddNewPdDialogComponent,
  AddNewQuestionComponent,
  DialogEkycInfoDetailComponent,
  PlCheckElementComponent,
  MerchantImageUploadComponent,
  MonexLoadingComponent,
  ProductStatusDialogComponent,
  ProductWorkflowDialogComponent,
  MonexProductDialogComponent,
  SearchSelectFilterComponent,
  MerchantQrCodeDialogComponent,
];

export * from './dialogs/confirmation-dialog/confirmation-dialog.component';
export * from './show-errors/show-errors.component';
export * from './dialogs/pl-prompt/pl-prompt.component';
export * from './inputs/otp-input/otp-input.component';
export * from './inputs/single-otp-input/single-otp-input.component';
export * from './dialogs/pl-loading/pl-loading.component';
export * from './base/base-management-layout/base-management-layout.component';
export * from './base/base-filter-form/base-filter-form.component';
export * from './base/base-expanded-table/base-expanded-table.component';
export * from './base/base-breadcrumb/base-breadcrumb.component';
export * from './statutes/pl-inline-message/pl-inline-message.component';
export * from './statutes/pl-status-label/pl-status-label.component';
export * from './button/document-button/document-button.component';
export * from './upload-area/upload-document-area/upload-document-area.component';
export * from './statutes/pl-status-element/pl-status-element.component';
export * from './statutes/format-data/format-data.component';
export * from './base/base-filter-form/filter-boxes/datetime-filter/datetime-filter.component';
export * from './base/base-filter-form/filter-boxes/multiple-choice-filter/multiple-choice-filter.component';
export * from './base/base-filter-form/filter-boxes/select-filter/select-filter.component';
export * from './operators/customer/customer-document-info/customer-document-info.component';
export * from './operators/customer/customer-company-info/customer-company-info.component';
export * from './operators/customer/dialog-company-info-update/dialog-company-info-update.component';
export * from './statutes/table-cell-format-data/table-cell-format-data.component';
export * from './dialogs/fullsize-image-dialog/fullsize-image-dialog.component';
export * from './operators/user-account/permission-tree/permission-tree.component';
export * from './operators/user-account/edit-role-dialog/edit-role-dialog.component';
export * from './operators/user-account/add-new-user-dialog/add-new-user-dialog.component';
export * from './operators/user-account/dialog-user-info-update/dialog-user-info-update.component';
export * from './operators/merchant/merchant-detail-dialog/merchant-detail-dialog.component';
export * from './operators/merchant/merchant-group-dialog/merchant-group-dialog.component';
export * from './operators/user-account/change-user-password-dialog/change-user-password-dialog.component';
export * from './operators/pd-system/add-new-pd-dialog/add-new-pd-dialog.component';
export * from './operators/pd-system/add-new-question/add-new-question.component';
export * from './operators/customer/dialog-ekyc-info-detail/dialog-ekyc-info-detail.component';
export * from './statutes/pl-check-element/pl-check-element.component';
export * from './operators/merchant/merchant-image-upload/merchant-image-upload.component';
export * from './loading/monex-loading/monex-loading.component';
export * from './operators/product-config/product-status-dialog/product-status-dialog.component';
export * from './operators/product-config/product-workflow-dialog/product-workflow-dialog.component';
export * from './operators/product-config/monex-product-dialog/monex-product-dialog.component';
export * from './base/base-filter-form/filter-boxes/search-select-filter/search-select-filter.component';
export * from './operators/merchant/merchant-qr-code-dialog/merchant-qr-code-dialog.component';
