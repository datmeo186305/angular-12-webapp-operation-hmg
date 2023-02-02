import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Merchant } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';
import {
  DOCUMENT_TYPE,
  DOCUMENT_TYPE_MAPPING_FIELD,
} from '../../../../../core/common/enum/payday-loan';
import { CustomerDetailService } from '../../../../../pages/customer/components/customer-detail-element/customer-detail.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { UpdatedDocumentModel } from '../../../../../public/models/external/updated-document.model';
import {
  BUTTON_TYPE,
  DOCUMENT_BTN_TYPE,
} from '../../../../../core/common/enum/operator';
import { AdminControllerService } from '../../../../../../../open-api-modules/bnpl-api-docs';
import fileToBase64 from '../../../../../core/utils/file-to-base64';
import * as isBase64 from 'is-base64';
import { AbstractControl, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-merchant-image-upload',
  templateUrl: './merchant-image-upload.component.html',
  styleUrls: ['./merchant-image-upload.component.scss'],
})
export class MerchantImageUploadComponent implements OnInit {
  _merchantInfo;
  @Input()
  get merchantInfo(): Merchant {
    return this._merchantInfo;
  }

  set merchantInfo(value: Merchant) {
    this._getDocumentByPath(value);
    this._merchantInfo = value;
  }

  _merchantId: string;
  @Input()
  get merchantId(): string {
    return this._merchantId;
  }

  set merchantId(value: string) {
    this._merchantId = value;
  }

  @Input()
  get merchantLogo(): any {
    return this.logoSrc;
  }

  set merchantLogo(value) {
    if (this.logoSrc != value) {
      this.logoSrc = value;
    }
  }

  @Input()
  get merchantDescriptionImg(): any {
    return this.imagesSrc;
  }

  set merchantDescriptionImg(value: any) {
    if (this.imagesSrc != value) {
      this.imagesSrc = value || [];
    }
  }
  @Input() isCreateMode: boolean = false;
  @Input() isViewMode: boolean = false;
  @Input() ngForm: FormGroupDirective;
  @Input() logoControl: AbstractControl;
  @Input() descriptionImgControl: AbstractControl;

  @Output() refreshContent = new EventEmitter<any>();
  @Output() changeLogoSrc = new EventEmitter<any>();
  @Output() changeDescriptionImgs = new EventEmitter<any>();

  maxCountFile: number = 5;
  maxSizeOfFile: number = 2; //MB
  subManager = new Subscription();
  selfieSrc: string;
  backIdSrc: string;
  logoSrc: string;
  imagesSrc: any[] = [];
  documentTypes = DOCUMENT_TYPE;
  hiddenUploadBtn: boolean = false;
  inputFiles: any;
  hiddenDeleteBtn: boolean = false;

  constructor(
    private customerDetailService: CustomerDetailService,
    private adminControllerService: AdminControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private notifier: ToastrService,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit(): void {
    this._initSubscription();
  }

  private _initSubscription() {
    // this.subManager.add(
    //   this.permissionsService.permissions$.subscribe((permissions) => {
    //     if (permissions) {
    //       this._checkActionPermissions();
    //     }
    //   })
    // );
  }

  private _getDocumentByPath(merchantInfo) {
    if (!merchantInfo) {
      return;
    }

    if (merchantInfo?.logo) {
      this._mapDocumentSrc(merchantInfo?.logo, DOCUMENT_TYPE.LOGO);
    }
    if (merchantInfo?.descriptionImg) {
      this._mapDocumentSrc(merchantInfo?.descriptionImg, DOCUMENT_TYPE.IMAGES);
    }
  }

  private _mapDocumentSrc(data: any, documentType: DOCUMENT_TYPE) {
    switch (documentType) {
      case DOCUMENT_TYPE.LOGO:
        this.logoSrc = data;
        break;
      case DOCUMENT_TYPE.IMAGES:
        this.imagesSrc = data;
        break;
      default:
        break;
    }
  }

  private _deleteDocument(documentType: DOCUMENT_TYPE, imgSrc) {
    if (documentType === DOCUMENT_TYPE.LOGO) {
      this.logoSrc = null;
      this.changeLogoSrc.emit(null);
    } else if (documentType === DOCUMENT_TYPE.IMAGES) {
      this.removeItem(this.imagesSrc, imgSrc);
      this.changeDescriptionImgs.emit(this.imagesSrc);
    }
  }

  removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  private _downloadDocumentByPath(documentPath) {
    this.notifier.info(
      this.multiLanguageService.instant('common.process_downloading')
    );
    this.subManager.add(
      this.customerDetailService
        .downloadFileDocument(this.merchantId, documentPath)
        .subscribe((result) => {})
    );
  }

  private _deleteDocumentPath(documentType: DOCUMENT_TYPE, imgSrc) {
    let promptDialogRef = this.notificationService.openPrompt({
      title: this.multiLanguageService.instant('common.are_you_sure'),
      content: this.multiLanguageService.instant('common.cant_revert'),
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      primaryBtnText: this.multiLanguageService.instant('common.ok'),
      secondaryBtnText: this.multiLanguageService.instant('common.cancel'),
    });

    let updateInfoRequest = {};
    updateInfoRequest[DOCUMENT_TYPE_MAPPING_FIELD[documentType]] = null;

    this.subManager.add(
      promptDialogRef.afterClosed().subscribe((buttonType: BUTTON_TYPE) => {
        if (buttonType === BUTTON_TYPE.PRIMARY) {
          this._deleteDocument(documentType, imgSrc);
        }
      })
    );
  }

  public onChangeDocument(
    updatedDocumentModel: UpdatedDocumentModel,
    documentPath: string,
    documentType: DOCUMENT_TYPE,
    index?
  ) {
    switch (updatedDocumentModel.type) {
      case DOCUMENT_BTN_TYPE.UPLOAD:
      case DOCUMENT_BTN_TYPE.UPDATE:
        if (documentType === DOCUMENT_TYPE.LOGO) {
          this.logoSrc = updatedDocumentModel.imgSrc;
          this.changeLogoSrc.emit(this.logoSrc);
        } else if (documentType === DOCUMENT_TYPE.IMAGES) {
          this.imagesSrc[index] = updatedDocumentModel.imgSrc;
          this.changeDescriptionImgs.emit(this.imagesSrc);
        }
        break;
      case DOCUMENT_BTN_TYPE.DOWNLOAD:
        if (this.isBase64Img(documentPath)) {
          return;
        }
        this._downloadDocumentByPath(documentPath);
        break;
      case DOCUMENT_BTN_TYPE.DELETE:
        if (documentType === DOCUMENT_TYPE.LOGO) {
          this._deleteDocumentPath(documentType, this.logoSrc);
        } else if (documentType === DOCUMENT_TYPE.IMAGES) {
          this._deleteDocumentPath(documentType, this.imagesSrc[index]);
        }
        break;
      default:
        break;
    }
  }

  triggerClickInsertImageInput() {
    if (this.imagesSrc.length >= 5) {
      return;
    }
    document.getElementById('import-merchant-files').click();
  }

  // triggerClickResetInput(): void {
  //   let resetInput: HTMLElement = document.getElementById(
  //     `reset-merchant-files`
  //   ) as HTMLElement;
  //   if (!resetInput) return;
  //   resetInput.click();
  // }

  async onChangeInputFiles($event) {
    let files = $event.target.files;
    let validFiles: any[] = Array.from(files);

    if (files.length > this.maxCountFile - this.imagesSrc.length) {
      validFiles = Array.from(files).slice(
        0,
        this.maxCountFile - this.imagesSrc.length
      );
    }
    let srcFiles = await this.convertFilesToBase64(validFiles);
    this.imagesSrc.push(...srcFiles);
    this.changeDescriptionImgs.emit(this.imagesSrc);
    this.inputFiles = null;
    // this.triggerClickResetInput();
  }

  async convertFilesToBase64(files: any[]) {
    let result: any[] = [];
    for (const file of files) {
      result.push(await fileToBase64(file));
    }
    return result;
  }

  public isBase64Img(imgSrc) {
    return isBase64(imgSrc, { mimeRequired: true });
  }

  getErrorMessage(controlName: AbstractControl) {
    if (
      controlName === this.logoControl &&
      this.logoControl.hasError('required')
    ) {
      return this.multiLanguageService.instant(
        'merchant.merchant_dialog.require_logo'
      );
    }

    if (
      controlName === this.descriptionImgControl &&
      this.descriptionImgControl.hasError('required')
    ) {
      return this.multiLanguageService.instant(
        'merchant.merchant_dialog.require_desc_img'
      );
    }
  }

  shouldShowErrors(control: AbstractControl): boolean {
    return control && control.errors && this.ngForm.submitted;
  }
}
