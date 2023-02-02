import * as fromFeature from '../reducers';
import { createSelector } from '@ngrx/store';

// selectors
export const getCommonInfoState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.common
);
