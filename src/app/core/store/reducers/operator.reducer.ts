import * as fromActions from '../actions';
import { NAV_ITEM } from '../../common/enum/operator';
import { PlLoading } from '../../../public/models/external/plloading.model';

export interface OperatorState {
  activeNavItem: NAV_ITEM;
  showLoading: boolean;
  loadingContent: PlLoading;
}

export const OPERATOR_INITIAL_STATE: OperatorState = {
  activeNavItem: NAV_ITEM.DASHBOARD,
  showLoading: false,
  loadingContent: {},
};

class OperatorActions {
  constructor(
    private state: OperatorState,
    private action: fromActions.OperatorActions
  ) {}

  setActiveNavItem() {
    const payload = this.action.payload;

    return { ...this.state, activeNavItem: payload };
  }

  resetActiveNavItem() {
    return { ...this.state, activeNavItem: NAV_ITEM.DASHBOARD };
  }

  setLoadingStatus() {
    const payload = this.action.payload;
    return {
      ...this.state,
      showLoading: payload.showLoading,
      loadingContent: payload.loadingContent,
    };
  }

  resetLoadingStatus() {
    const payload = this.action.payload;
    return {
      ...this.state,
      showLoading: false,
      loadingContent: {},
    };
  }
}

export function operatorReducer(
  state: OperatorState = OPERATOR_INITIAL_STATE,
  action: fromActions.OperatorActions
): OperatorState {
  const operatorActions: OperatorActions = new OperatorActions(state, action);

  switch (action.type) {
    case fromActions.SET_ACTIVE_NAV_ITEM: {
      return operatorActions.setActiveNavItem();
    }

    case fromActions.RESET_ACTIVE_NAV_ITEM: {
      return operatorActions.resetActiveNavItem();
    }

    case fromActions.SET_LOADING_STATUS: {
      return operatorActions.setLoadingStatus();
    }

    case fromActions.RESET_LOADING_STATUS: {
      return operatorActions.resetLoadingStatus();
    }


    default: {
      return state;
    }
  }
}
