import { LoanListComponent } from './payday-loan/loan-list/loan-list.component';
import { Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TitleConstants } from '../../core/common/constants/title-constants';
import { BnplListComponent } from './bnpl/bnpl-list/bnpl-list.component';
import { PermissionConstants } from '../../core/common/constants/permission-constants';

export const ProductRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'payday-loan',
        component: LoanListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.PAYDAY_LOAN,
          animation: true,
          permissions: {
            only: [
              PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_HMG,
              PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_TNG,
              PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_VAC,
            ],
            redirectTo: '/',
          },
        },
      },
      {
        path: 'bnpl',
        component: BnplListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.BNPL,
          animation: true,
          permissions: {
            only: [PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_BNPL],
            redirectTo: '/',
          },
        },
      },
    ],
  },
];
