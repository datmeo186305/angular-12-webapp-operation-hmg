import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DOCUMENT_BTN_TYPE } from '../../../../core/common/enum/operator';
import { UpdatedDocumentModel } from '../../../../public/models/external/updated-document.model';
import isBase64 from '../../../../core/utils/is-base-64';
import urlToFile from '../../../../core/utils/url-to-file';
import getUrlFileName from '../../../../core/utils/get-url-file-name';
import getUrlExtension from '../../../../core/utils/get-url-extension';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-upload-document-area',
  templateUrl: './upload-document-area.component.html',
  styleUrls: ['./upload-document-area.component.scss'],
})
export class UploadDocumentAreaComponent implements OnInit, AfterViewInit {
  @Input() id: string;
  @Input() title: string;
  @Input() classes: string;
  @Input() description: string;
  @Input() name: string = 'image-upload-area';
  @Input() hiddenUploadBtn: boolean = false;
  @Input() hiddenUpdateBtn: boolean = false;
  @Input() hiddenDownloadBtn: boolean = false;
  @Input() acceptFileType: string = 'image/*';
  @Input() hiddenDeleteBtn: boolean = false;
  @Input() maxSizeOfFile: number = 5; //MB
  public viewerOptions: any = {
    navbar: false,
    toolbar: {
      zoomIn: 4,
      zoomOut: 4,
      oneToOne: 4,
      reset: 4,
      rotateLeft: 4,
      rotateRight: 4,
      flipHorizontal: 4,
      flipVertical: 4,
    },
  };
  _imageSrc: any;

  get imgSrc(): any {
    return this._imageSrc;
  }

  @Input() set imgSrc(newVal: any) {
    if (!newVal) {
      this.file = null;
    }
    this._imageSrc = newVal;
  }

  file: any;

  @Output() onChangeDocument = new EventEmitter<UpdatedDocumentModel>();

  documentBtnTypes = DOCUMENT_BTN_TYPE;

  currentDocumentBtnType: DOCUMENT_BTN_TYPE;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {}

  changeDocument(documentBtnType: DOCUMENT_BTN_TYPE) {
    this.currentDocumentBtnType = documentBtnType;
    switch (documentBtnType) {
      case DOCUMENT_BTN_TYPE.UPDATE:
      case DOCUMENT_BTN_TYPE.UPLOAD:
        this.triggerClickUploadImg();
        break;
      case DOCUMENT_BTN_TYPE.DOWNLOAD:
      case DOCUMENT_BTN_TYPE.DELETE:
        this.onChangeDocument.emit({
          type: documentBtnType,
        });
        break;
      default:
        break;
    }
  }

  triggerClickUploadImg(): void {
    let manualUploadInput: HTMLElement = document.getElementById(
      `manual-upload-input-${this.id}`
    ) as HTMLElement;
    if (!manualUploadInput) return;
    manualUploadInput.click();
  }

  triggerClickResetInput(): void {
    let resetInput: HTMLElement = document.getElementById(
      `reset-manual-upload-input-${this.id}`
    ) as HTMLElement;
    if (!resetInput) return;
    resetInput.click();
  }

  onFileChange(e): void {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.createImage(files[0]);
  }

  createImage(file): void {
    if (!(file instanceof File)) {
      return null;
    }
    let reader = new FileReader();
    reader.onload = (e) => {
      this.onChangeDocument.emit({
        type: this.currentDocumentBtnType,
        imgSrc: e.target.result,
        file: file,
      });
    };
    reader.readAsDataURL(file);
  }

  initImgSrc(value): void {
    if (!value) {
      this.file = null;
    }
  }

  ngAfterViewInit(): void {
    this.initImgSrc(this.imgSrc);
  }

  openFullSizeImg(imageSrc) {
    this.notificationService.openImgFullsizeDiaglog({ imageSrc: imageSrc });
  }
}
