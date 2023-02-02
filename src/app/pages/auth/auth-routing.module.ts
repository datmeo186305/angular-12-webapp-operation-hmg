import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { TitleConstants } from '../../core/common/constants/title-constants';

export const AuthRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
        data: {
          title: TitleConstants.TITLE_VALUE.SIGN_IN,
          animation: true,
        },
      },
    ],
  },
];
