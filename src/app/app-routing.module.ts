import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardService as AuthGuard } from './core/services/auth-guard.service';
import { CustomPreloadingStrategy } from './core/common/providers/custom-preloading-strategy';
import { TitleConstants } from './core/common/constants/title-constants';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          title: TitleConstants.TITLE_VALUE.DASHBOARD,
          animation: true,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./pages/products/product.module').then(
            (m) => m.ProductModule
          ),
        data: { preload: true, delay: true },
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./pages/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
        data: { preload: true, delay: false },
      },
      {
        path: 'system',
        loadChildren: () =>
          import('./pages/system/system.module').then((m) => m.SystemModule),
        data: { preload: false, delay: true },
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.module').then((m) => m.AuthModule),
        data: { preload: true, delay: false },
      },
      {
        path: '**',
        component: NotFoundComponent,
        data: {
          title: TitleConstants.TITLE_VALUE.NOT_FOUND,
          animation: true,
        },
      },
    ],
  },
];

// Reference :https://angular.io/api/router/ExtraOptions

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'corrected',
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy],
})
export class AppRoutingModule {}
