import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
// import { AuthGuardService as AuthGuard } from '../../../core/services/auth-guard.service';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TitleConstants } from '../../core/common/constants/title-constants';
import { PermissionConstants } from '../../core/common/constants/permission-constants';

export const CustomerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: CustomerListComponent,
        canActivateChild: [NgxPermissionsGuard],
        data: {
          title: TitleConstants.TITLE_VALUE.CUSTOMER,
          animation: true,
          permissions: {
            only: [PermissionConstants.DASHBOARD_PERMISSION.GET_LIST_CUSTOMER],
            redirectTo: '/',
          },
        },
      },
    ],
  },
];
