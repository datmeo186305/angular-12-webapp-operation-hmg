import { DOCUMENT_BTN_TYPE } from 'src/app/core/common/enum/operator';

export interface UpdatedDocumentModel {
  type: DOCUMENT_BTN_TYPE;
  imgSrc?: any;
  file?: any;
}
