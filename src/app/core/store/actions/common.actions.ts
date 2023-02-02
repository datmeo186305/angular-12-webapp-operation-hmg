import { Action } from '@ngrx/store';

export const GET_COMMON_INFO = '[Common] get customer info';
export const SET_COMMON_INFO = '[Common] set customer info';
export const RESET_COMMON_INFO = '[Common] reset customer info';

export class GetCommonInfo implements Action {
  readonly type = GET_COMMON_INFO;

  constructor(public payload?: any) {}
}

export class SetCommonInfo implements Action {
  readonly type = SET_COMMON_INFO;

  constructor(public payload: any) {}
}

export class ResetCommonInfo implements Action {
  readonly type = RESET_COMMON_INFO;

  constructor(public payload?: any) {}
}

export type CommonActions =
  | GetCommonInfo
  | SetCommonInfo
  | ResetCommonInfo;
