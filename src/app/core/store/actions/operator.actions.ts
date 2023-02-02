import { Action } from '@ngrx/store';
import { NAV_ITEM } from '../../common/enum/operator';

export const SET_ACTIVE_NAV_ITEM = '[Operator] set operator info';
export const RESET_ACTIVE_NAV_ITEM = '[Operator] reset operator info';
export const SET_LOADING_STATUS = '[Operator] set show loading status';
export const RESET_LOADING_STATUS = '[Operator] reset show loading status';

export class SetOperatorInfo implements Action {
  readonly type = SET_ACTIVE_NAV_ITEM;

  constructor(public payload: NAV_ITEM) {}
}

export class ResetOperatorInfo implements Action {
  readonly type = RESET_ACTIVE_NAV_ITEM;

  constructor(public payload?: any) {}
}

export class SetLoadingStatus implements Action {
  readonly type = SET_LOADING_STATUS;

  constructor(public payload: any) {}
}

export class ResetLoadingStatus implements Action {
  readonly type = RESET_LOADING_STATUS;

  constructor(public payload?: any) {}
}

export type OperatorActions =
  | SetOperatorInfo
  | ResetOperatorInfo
  | SetLoadingStatus
  | ResetLoadingStatus;
