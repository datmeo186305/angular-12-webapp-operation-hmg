import { StrongPasswordValidatorDirective } from './strong-password.validator';
import { PhoneNumberValidatorDirective } from './phone-number.validator';
import { ConfirmPasswordValidatorDirective } from './confirm-password.validator';

export const validators: any[] = [
  StrongPasswordValidatorDirective,
  PhoneNumberValidatorDirective,
  ConfirmPasswordValidatorDirective,
];

export * from './strong-password.validator';
export * from './phone-number.validator';
export * from './confirm-password.validator';
