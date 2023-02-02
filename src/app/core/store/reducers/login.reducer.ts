import * as actions from '../actions';
import { Auth } from '../../../public/models';
import { HttpErrorResponse } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Token } from '../../../public/models/auth/token.model';
import { RESPONSE_CODE } from '../../common/enum/operator';

export interface LoginState {
  authorization: Auth;
  loginProcess: string;
  loginError: HttpErrorResponse;
}

export const LOGIN_INITIAL_STATE: LoginState = {
  authorization: null,
  loginProcess: null,
  loginError: null,
};

class LoginActions {
  constructor(
    private state: LoginState,
    private action: actions.LoginActions
  ) {}

  signin() {
    const payload = this.action.payload;
    return {
      ...this.state,
      loginProcess: 'Proccess login...',
      customerMobile: payload.username,
    };
  }

  success() {
    if (
      !this.action.payload ||
      !this.action.payload.responseCode ||
      this.action.payload.responseCode !== RESPONSE_CODE.SUCCESS
    )
      return this.state;
    const decodedResult: Token = jwt_decode(this.action.payload.result?.token);
    const payload: Auth = {
      token: this.action.payload.result?.token,
      exp: decodedResult.exp,
      customerId: decodedResult.sub,
      authorities: decodedResult.authorities,
    };
    return {
      ...this.state,
      authorization: payload,
      loginProcess: 'Login success',
      loginError: null,
    };
  }

  error() {
    const payload = this.action.payload;
    return { ...this.state, loginError: payload, loginProcess: 'Login failed' };
  }

  logout() {
    return {
      ...this.state,
      loginProcess: null,
      loginError: null,
      coreToken: null,
    };
  }

  resetToken() {
    return {
      ...this.state,
      authorization: null,
    };
  }
}

export function loginReducer(
  state: LoginState = LOGIN_INITIAL_STATE,
  action: actions.LoginActions
): LoginState {
  const loginActions: LoginActions = new LoginActions(state, action);

  switch (action.type) {
    case actions.LOGIN_SIGNIN: {
      return loginActions.signin();
    }

    case actions.LOGIN_SIGNIN_SUCCESS: {
      return loginActions.success();
    }

    case actions.LOGIN_SIGNIN_ERROR: {
      return loginActions.error();
    }

    case actions.LOGIN_SIGN_OUT: {
      return loginActions.logout();
    }

    case actions.LOGIN_RESET_TOKEN: {
      return loginActions.resetToken();
    }

    default: {
      return state;
    }
  }
}
