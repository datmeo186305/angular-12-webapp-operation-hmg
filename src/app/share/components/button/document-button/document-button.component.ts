import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DOCUMENT_BTN_TYPE } from '../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../translate/multiLanguageService';

@Component({
  selector: 'app-document-button',
  templateUrl: './document-button.component.html',
  styleUrls: ['./document-button.component.scss'],
})
export class DocumentButtonComponent implements OnInit {
  @Input() documentType: DOCUMENT_BTN_TYPE;
  @Input() classes: string;
  @Output() clickBtn = new EventEmitter<DOCUMENT_BTN_TYPE>();

  get documentBtnInfo() {
    switch (this.documentType) {
      case DOCUMENT_BTN_TYPE.DOWNLOAD:
        return {
          title: this.multiLanguageService.instant(
            'customer.document_info.download'
          ),
          containerClass: 'op-img-download-btn',
          titleClass: 'op-img-download-btn-title',
          iconClass: 'sprite-group-5-download-green-small',
        };
      case DOCUMENT_BTN_TYPE.UPLOAD:
        return {
          title: this.multiLanguageService.instant(
            'customer.document_info.upload'
          ),
          containerClass: 'op-img-upload-btn',
          titleClass: 'op-img-upload-btn-title',
          iconClass: 'sprite-group-5-upload-blue-small',
        };
      case DOCUMENT_BTN_TYPE.UPDATE:
        return {
          title: this.multiLanguageService.instant(
            'customer.document_info.update'
          ),
          containerClass: 'op-img-upload-btn',
          titleClass: 'op-img-upload-btn-title',
          iconClass: 'sprite-group-5-upload-blue-small',
        };
      case DOCUMENT_BTN_TYPE.DELETE:
        return {
          title: this.multiLanguageService.instant(
            'customer.document_info.delete'
          ),
          containerClass: 'op-img-delete-btn',
          titleClass: 'op-img-delete-btn-title',
          iconClass: 'sprite-group-5-trash-red-small',
        };
      default:
        return {};
    }
  }

  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {}

  triggerClickBtn(documentType: DOCUMENT_BTN_TYPE) {
    this.clickBtn.emit(documentType);
  }
}
