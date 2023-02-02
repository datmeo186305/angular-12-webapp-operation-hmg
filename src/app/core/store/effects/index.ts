import {RouterEffects} from './router.effect';
import {LoginEffects} from './login.effect';
import {CustomerEffects} from './customer.effect';
import { CommonEffects } from './common.effect';

export const effects: any[] = [
  RouterEffects,
  LoginEffects,
  CustomerEffects,
  CommonEffects,
];

export * from './router.effect';
export * from './login.effect';
export * from './customer.effect';
export * from './common.effect';
