import { HiddenDirective } from './hidden.directive';
import { NumberOnlyDirective } from './number-only.directive';
import { PhoneNumberOnlyDirective } from './phone-number-only.directive';
import { ResizeColumnDirective } from './resize-column.directive';
import { PercentageDirective } from './percent.directive';
import { TypeMaxLengthDirective } from './type-max-length.directive';
import { CkEditorValidatorDirective } from './ck-editor-validator.directive';
import { MaxFileSizeDirective } from './max-file-size.directive';
import { MaxFileCountDirective } from './max-file-count.directive';
import { ImageFileOnlyDirective } from './image-file-only.directive';

export const directives: any[] = [
  HiddenDirective,
  NumberOnlyDirective,
  PhoneNumberOnlyDirective,
  ResizeColumnDirective,
  PercentageDirective,
  TypeMaxLengthDirective,
  CkEditorValidatorDirective,
  MaxFileSizeDirective,
  MaxFileCountDirective,
  ImageFileOnlyDirective,
];

export * from './hidden.directive';
export * from './number-only.directive';
export * from './phone-number-only.directive';
export * from './resize-column.directive';
export * from './percent.directive';
export * from './type-max-length.directive';
export * from './ck-editor-validator.directive';
export * from './max-file-size.directive';
export * from './max-file-count.directive';
export * from './image-file-only.directive';
