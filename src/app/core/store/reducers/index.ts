import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import * as fromRouterReducers from './router.reducer';
import * as fromLoginReducers from './login.reducer';
import * as fromCustomerReducers from './customer.reducer';
import * as fromOperatorReducers from './operator.reducer';
import * as fromCommonReducers from './common.reducer';

export * from './router.reducer';

// Feature by core module
export interface State {
  login: fromLoginReducers.LoginState;
  customer: fromCustomerReducers.CustomerState;
  common: fromCommonReducers.CommonState;
  routerReducer: fromRouter.RouterReducerState<fromRouterReducers.RouterStateUrl>;
  operator: fromOperatorReducers.OperatorState;
}

export const CORE_INITIAL_STATE: State = {
  login: fromLoginReducers.LOGIN_INITIAL_STATE,
  customer: fromCustomerReducers.CUSTOMER_INITIAL_STATE,
  common: null,
  routerReducer: null,
  operator: fromOperatorReducers.OPERATOR_INITIAL_STATE,
};

export const reducers: ActionReducerMap<State> = {
  routerReducer: fromRouter.routerReducer,
  login: fromLoginReducers.loginReducer,
  customer: fromCustomerReducers.customerReducer,
  common: fromCommonReducers.commonReducer,
  operator: fromOperatorReducers.operatorReducer,
};

export const getRouterState =
  createFeatureSelector<
    fromRouter.RouterReducerState<fromRouterReducers.RouterStateUrl>
  >('routerReducer');

export const getCoreState = createFeatureSelector<State>('core');
