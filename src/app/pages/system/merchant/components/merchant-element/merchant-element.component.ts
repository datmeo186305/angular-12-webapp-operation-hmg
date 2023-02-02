import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ApiResponseMerchant as DashboardApiResponseMerchant,
  Merchant,
  MerchantControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';

import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  BUTTON_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import {
  AdminControllerService,
  ApiResponseMerchant,
  ApiResponseString,
  BnplControllerService,
  MerchantStatus,
  UpdateAgentInformationDto,
  UpdateMerchantRequestDto,
} from '../../../../../../../open-api-modules/bnpl-api-docs';
import { DomSanitizer } from '@angular/platform-browser';
import { MerchantDetailDialogComponent } from '../../../../../share/components';
import * as moment from 'moment';
import * as isBase64 from 'is-base64';

@Component({
  selector: 'app-merchant-element',
  templateUrl: './merchant-element.component.html',
  styleUrls: ['./merchant-element.component.scss'],
})
export class MerchantElementComponent implements OnInit, OnDestroy {
  @Input() merchantInfo: Merchant;

  private _merchantId: string;

  @Input()
  get merchantId(): string {
    return this._merchantId;
  }

  set merchantId(value: string) {
    this._merchantId = value;
  }

  @Input() allMerchant: any[];
  @Input() bdStaffOptions: any[];
  @Input() managerOptions: any[];

  @Output() triggerUpdateElementInfo = new EventEmitter();

  merchantQr: any;
  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private notifier: ToastrService,
    private merchantControllerService: MerchantControllerService,
    private adminControllerService: AdminControllerService,
    private bnplControllerService: BnplControllerService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.generateQrCode(this.merchantId);
  }

  public generateQrCode(merchantId) {
    if (!merchantId) return;
    this.subManager.add(
      this.bnplControllerService
        .v1ApplicationQrcodePost({ merchantId: this.merchantId })
        .subscribe((data: ApiResponseString) => {
          if (!data || data.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(JSON.stringify(data?.message), data?.errorCode);
            return;
          }
          this.merchantQr = data.result;
        })
    );
  }

  public refreshContent() {
    setTimeout(() => {
      this.generateQrCode(this.merchantId);
      this._getMerchantInfoById(this.merchantId);
    }, 2000);
  }

  private _getMerchantInfoById(merchantId) {
    if (!merchantId) return;
    this.subManager.add(
      this.merchantControllerService
        .getMerchantById(this.merchantId)
        .subscribe((data: DashboardApiResponseMerchant) => {
          if (!data || data?.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(JSON.stringify(data?.message), data?.errorCode);
            return;
          }
          this.merchantInfo = data?.result;
          this.triggerUpdateElementInfo.emit(this.merchantInfo);
        })
    );
  }

  private _updateMerchantInfo(updateInfoRequest: UpdateMerchantRequestDto) {
    this.subManager.add(
      this.adminControllerService
        .v1AdminMerchantsIdPut(this.merchantId, updateInfoRequest)
        .subscribe((data) => {
          if (!data || data?.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(data?.message),
              data?.errorCode
            );
          }
          setTimeout(() => {
            this.notifier.success(
              this.multiLanguageService.instant('common.update_success')
            );
            this.generateQrCode(this.merchantId);
            this.merchantInfo = {
              ...this.merchantInfo,
              ...data?.result,
            };
            this.triggerUpdateElementInfo.emit(this.merchantInfo);
          }, 2000);
        })
    );
  }

  public lockPrompt() {
    const confirmLockRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/Alert.svg',
      title: this.multiLanguageService.instant(
        'merchant.merchant_detail.lock_merchant.title'
      ),
      content: this.multiLanguageService.instant(
        'merchant.merchant_detail.lock_merchant.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.lock'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmLockRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.adminControllerService
            .v1AdminMerchantsIdPut(this.merchantInfo.id, {
              status: MerchantStatus.Locked,
            })
            .subscribe((result: ApiResponseMerchant) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              setTimeout(() => {
                // this.refreshContent();
                this.notifier.success(
                  this.multiLanguageService.instant('common.lock_success')
                );
                this.generateQrCode(this.merchantId);
                this.merchantInfo = {
                  ...this.merchantInfo,
                  ...result?.result,
                };
                this.triggerUpdateElementInfo.emit(this.merchantInfo);
              }, 2000);
            })
        );
      }
    });
  }

  public unlockPrompt() {
    const confirmUnlockRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/unlock-dialog.svg',
      title: this.multiLanguageService.instant(
        'merchant.merchant_detail.unlock_merchant.title'
      ),
      content: '',
      primaryBtnText: this.multiLanguageService.instant('common.allow'),
      primaryBtnClass: 'btn-primary',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmUnlockRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.adminControllerService
            .v1AdminMerchantsIdPut(this.merchantInfo.id, {
              status: MerchantStatus.Active,
            })
            .subscribe((result: ApiResponseMerchant) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              setTimeout(() => {
                // this.refreshContent();
                this.notifier.success(
                  this.multiLanguageService.instant('common.unlock_success')
                );
                this.generateQrCode(this.merchantId);
                this.merchantInfo = {
                  ...this.merchantInfo,
                  ...result?.result,
                };
                this.triggerUpdateElementInfo.emit(this.merchantInfo);
              }, 3000);
            })
        );
      }
    });
  }

  public deletePrompt() {
    const confirmDeleteRef = this.notificationService.openPrompt({
      imgUrl: '../../../../../assets/img/icon/group-5/svg/delete-dialog.svg',
      title: this.multiLanguageService.instant(
        'merchant.merchant_detail.delete_merchant.title'
      ),
      content: this.multiLanguageService.instant(
        'merchant.merchant_detail.delete_merchant.content'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.delete'),
      primaryBtnClass: 'btn-error',
      secondaryBtnText: this.multiLanguageService.instant('common.skip'),
    });
    confirmDeleteRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.subManager.add(
          this.adminControllerService
            .v1AdminMerchantsIdDelete(this.merchantInfo.id)
            .subscribe((result: ApiResponseString) => {
              if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
                return this.notifier.error(
                  JSON.stringify(result?.message),
                  result?.errorCode
                );
              }
              if (result.responseCode === 200) {
                this.triggerUpdateElementInfo.emit();
                setTimeout(() => {
                  this.notifier.success(
                    this.multiLanguageService.instant(
                      'merchant.merchant_detail.delete_merchant.toast'
                    )
                  );
                }, 3000);
              }
            })
        );
      }
    });
  }

  openUpdateDialog(tabIndex) {
    const updateDialogRef = this.dialog.open(MerchantDetailDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '1200px',
      width: '90%',
      data: {
        merchantInfo: this.merchantInfo,
        dialogTitle: this.multiLanguageService.instant(
          'merchant.merchant_dialog.edit_merchant_title'
        ),
        tabIndex: tabIndex,
        allMerchant: this.allMerchant,
        bdStaffOptions: this.bdStaffOptions,
        managerOptions: this.managerOptions,
      },
    });
    this.subManager.add(
      updateDialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.type === BUTTON_TYPE.PRIMARY) {
          let updateInfoRequest = this._bindingDialogData(result.data);
          this._updateMerchantInfo(updateInfoRequest);
        }
      })
    );
  }

  private _bindingDialogData(data) {
    let request = {};

    this.bindingMerchantInfo(data, request);

    this.bindingAgentInfo(data, request);

    this.biddingDescriptionInfo(data, request);

    return request;
  }

  bindingMerchantInfo(data, request) {
    if (data?.code != this.merchantInfo?.code) {
      request['code'] = data?.code;
    }

    if (data?.name != this.merchantInfo?.name) {
      request['name'] = data?.name;
    }

    if (data?.address != this.merchantInfo?.address) {
      request['address'] = data?.address;
    }
    if (data?.ward != this.merchantInfo?.ward) {
      request['ward'] = data?.ward;
    }
    if (data?.district != this.merchantInfo?.district) {
      request['district'] = data?.district;
    }
    if (data?.province != this.merchantInfo?.province) {
      request['province'] = data?.province;
    }
    if (data?.bdStaffId != this.merchantInfo?.bdStaffId) {
      request['bdStaffId'] = data?.bdStaffId;
    }

    if (data?.merchantManagerId != this.merchantInfo?.merchantManagerId) {
      request['merchantManagerId'] = data?.merchantManagerId;
    }

    if (
      JSON.stringify(data?.merchantSellType) !=
      JSON.stringify(this.merchantInfo?.merchantSellType)
    ) {
      request['merchantSellType'] = data?.merchantSellType;
    }
    if (data?.mobile != this.merchantInfo?.mobile) {
      request['mobile'] = data?.mobile;
    }
    if (data?.email != this.merchantInfo?.email) {
      request['email'] = data?.email;
    }

    if (data?.website != this.merchantInfo?.website) {
      request['website'] = data?.website;
    }

    if (data?.mobile != this.merchantInfo?.mobile) {
      request['mobile'] = data?.mobile;
    }

    if (data?.identificationNumber != this.merchantInfo?.identificationNumber) {
      request['identificationNumber'] = data?.identificationNumber;
    }

    if (
      JSON.stringify(data?.productTypes) !=
      JSON.stringify(this.merchantInfo?.productTypes)
    ) {
      request['productTypes'] = data?.productTypes;
    }
    if (data?.status != this.merchantInfo?.status) {
      request['status'] = data?.status;
    }

    if (data?.merchantParentId != this.merchantInfo?.merchantParentId) {
      request['merchantParentId'] = data?.merchantParentId;
    }

    if (
      JSON.stringify(data?.merchantFeatures) !=
      JSON.stringify(this.merchantInfo?.merchantFeatures)
    ) {
      request['merchantFeatures'] = data?.merchantFeatures;
    }

    if (
      this.formatTime(data?.establishTime) != this.merchantInfo?.establishTime
    ) {
      request['establishTime'] = this.formatTime(data?.establishTime);
    }
    if (
      data?.customerServiceFee !=
      this.merchantInfo?.customerServiceFee * 100
    ) {
      request['customerServiceFee'] = data?.customerServiceFee / 100;
    }
    if (
      data?.merchantServiceFee !=
      this.merchantInfo?.merchantServiceFee * 100
    ) {
      request['merchantServiceFee'] = data?.merchantServiceFee / 100;
    }
  }

  bindingAgentInfo(data, request) {
    let agentInfo: UpdateAgentInformationDto = {};
    if (data?.managerMobile != this.merchantInfo?.agentInformation?.mobile) {
      agentInfo.mobile = data?.managerMobile;
    }
    if (
      data?.managerPosition != this.merchantInfo?.agentInformation?.position
    ) {
      agentInfo.position = data?.managerPosition;
    }
    if (data?.managerEmail != this.merchantInfo?.agentInformation?.email) {
      agentInfo.email = data?.managerEmail;
    }

    if (
      agentInfo.email != null ||
      agentInfo.mobile != null ||
      agentInfo.position != null
    ) {
      request['updateAgentInformationDto'] = agentInfo;
    }
  }

  biddingDescriptionInfo(data, request) {
    if (data?.logo != this.merchantInfo?.logo) {
      request['logo'] = data?.logo;
    }
    if (data?.description != this.merchantInfo?.description) {
      request['description'] = data?.description;
    }

    if (data?.descriptionImg != this.merchantInfo?.descriptionImg) {
      let newImages = [];
      let deletedImages = [];

      data?.descriptionImg.forEach((newImg) => {
        if (isBase64(newImg, { mimeRequired: true })) {
          newImages.push(newImg);
        }
      });

      this.merchantInfo?.descriptionImg.forEach((imgSrc) => {
        if (data?.descriptionImg.includes(imgSrc)) {
          return;
        }
        deletedImages.push(imgSrc);
      });

      if (deletedImages.length > 0) {
        request['deleteDescImageMerchant'] = deletedImages;
      }

      if (newImages.length > 0) {
        request['appendDescImageMerchant'] = newImages;
      }
    }
  }

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
