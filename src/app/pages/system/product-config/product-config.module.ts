import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigDocumentListComponent } from './config-document/config-document-list/config-document-list.component';
import { ConfigContractListComponent } from './config-contract/config-contract-list/config-contract-list.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SharedModule } from '../../../share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TitleConstants } from '../../../core/common/constants/title-constants';
import { ApplicationDocumentSaveDialogComponent } from './config-document/components/application-document-save-dialog/application-document-save-dialog.component';
import { DocumentTypeListComponent } from './config-document/document-type-list/document-type-list.component';
import { DocumentTypeSaveDialogComponent } from './config-document/components/document-type-save-dialog/document-type-save-dialog.component';
import { MonexProductListComponent } from './monex-product/monex-product-list/monex-product-list.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProductStatusListComponent } from './product-status/product-status-list/product-status-list.component';
import { ProductWorkflowListComponent } from './product-workflow/product-workflow-list/product-workflow-list.component';
import { ConfigContractSaveDialogComponent } from './config-contract/components/config-contract-save-dialog/config-contract-save-dialog.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { PermissionConstants } from '../../../core/common/constants/permission-constants';

export const ProductConfigRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'product-list',
        component: MonexProductListComponent,
        data: {
          title: TitleConstants.TITLE_VALUE.MONEX_PRODUCT,
          animation: true,
        },
      },
      {
        path: 'product-status',
        component: ProductStatusListComponent,
        data: {
          title: TitleConstants.TITLE_VALUE.PRODUCT_STATUS,
          animation: true,
        },
      },
      {
        path: 'product-workflow',
        component: ProductWorkflowListComponent,
        data: {
          title: TitleConstants.TITLE_VALUE.PRODUCT_WORKFLOW,
          animation: true,
        },
      },
      {
        path: 'document',
        component: ConfigDocumentListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.CONFIG_DOCUMENT_LIST,
          animation: true,
          permissions: {
            only: [PermissionConstants.APPLICATION_DOCUMENT_PERMISSION.GET_LIST],
            redirectTo: '/',
          },
        },
      },
      {
        path: 'document-type',
        component: DocumentTypeListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.CONFIG_DOCUMENT_TYPE_LIST,
          animation: true,
          permissions: {
            only: [PermissionConstants.APPLICATION_DOCUMENT_TYPE_PERMISSION.GET_LIST],
            redirectTo: '/',
          },
        },
      },
      {
        path: 'contract',
        component: ConfigContractListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.CONFIG_CONTRACT_LIST,
          animation: true,
          permissions: {
            only: [PermissionConstants.CONTRACT_TEMPLATE_PERMISSION.GET_LIST],
            redirectTo: '/',
          },
        },
      },
    ],
  },
];

@NgModule({
  declarations: [
    ConfigDocumentListComponent,
    ConfigContractListComponent,
    ApplicationDocumentSaveDialogComponent,
    DocumentTypeListComponent,
    DocumentTypeSaveDialogComponent,
    MonexProductListComponent,
    ProductStatusListComponent,
    ProductWorkflowListComponent,
    ConfigContractSaveDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductConfigRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
    CKEditorModule,
  ],
})
export class ProductConfigModule {}
