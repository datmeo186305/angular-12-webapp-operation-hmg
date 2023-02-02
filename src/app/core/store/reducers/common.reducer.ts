import * as fromActions from '../actions';
import { HttpErrorResponse } from '@angular/common/http';
import { RESPONSE_CODE } from '../../common/enum/operator';
import { Bank, CompanyInfo } from 'open-api-modules/dashboard-api-docs';

export interface CommonState {
  BankOptions: Array<Bank>;
  CompanyOptions: Array<CompanyInfo>;
}

class CommonActions {
  constructor(
    private state: CommonState,
    private action: fromActions.CommonActions
  ) {}

  getCommonInfo() {
    const payload = this.action.payload;

    return { ...this.state };
  }

  setCommonInfo() {
    const payload = this.action.payload;

    return { ...this.state, commonInfo: payload };
  }

  resetCommonInfo() {
    return { ...this.state, commonInfo: null };
  }
}

export function commonReducer(
  state: CommonState = null,
  action: fromActions.CommonActions
): CommonState {
  const commonActions: CommonActions = new CommonActions(state, action);

  switch (action.type) {
    case fromActions.GET_COMMON_INFO: {
      return commonActions.getCommonInfo();
    }

    case fromActions.SET_COMMON_INFO: {
      return commonActions.setCommonInfo();
    }

    case fromActions.RESET_COMMON_INFO: {
      return commonActions.resetCommonInfo();
    }

    default: {
      return state;
    }
  }
}
