import { Routes } from '@angular/router';
import { TitleConstants } from '../../core/common/constants/title-constants';

export const SystemRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
        data: {
          title: TitleConstants.TITLE_VALUE.USER,
        },
      },
      {
        path: 'merchant',
        loadChildren: () =>
          import('./merchant/merchant.module').then((m) => m.MerchantModule),
        data: {
          title: TitleConstants.TITLE_VALUE.MERCHANT,
        },
      },
      {
        path: 'product-config',
        loadChildren: () =>
          import('./product-config/product-config.module').then(
            (m) => m.ProductConfigModule
          ),
      },
      {
        path: 'pd-system',
        loadChildren: () =>
          import('./pd-system/pd-system.module').then((m) => m.PdSystemModule),
      },
    ],
  },
];
