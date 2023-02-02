import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomerInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import { VirtualAccount } from '../../../../../../open-api-modules/payment-api-docs';
import { Bank } from 'open-api-modules/dashboard-api-docs';
import { BUTTON_TYPE } from '../../../../core/common/enum/operator';
import { Subject, Subscription } from 'rxjs';
import {
  CityControllerService,
  DistrictControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-detail-update-dialog',
  templateUrl: './customer-detail-update-dialog.component.html',
  styleUrls: ['./customer-detail-update-dialog.component.scss'],
})
export class CustomerDetailUpdateDialogComponent implements OnInit {
  customerInfo: CustomerInfo = {};
  virtualAccount: VirtualAccount = {};
  bankOptions: Array<Bank>;
  customerId: string = '';
  selfieSrc: string;
  // cityData: any[];
  // districtData: any[];
  // communeData: any[];
  filteredBanks: any[];
  // filteredCities: any[];
  // filteredDistricts: any[];
  // filteredCommunes: any[];
  banksFilterCtrl: FormControl = new FormControl();
  // citiesFilterCtrl: FormControl = new FormControl();
  // districtsFilterCtrl: FormControl = new FormControl();
  // communesFilterCtrl: FormControl = new FormControl();
  subManager = new Subscription();
  _onDestroy = new Subject<void>();

  customerIndividualForm: FormGroup;

  maxDateTime = moment(new Date(), 'YYYY-MM-DD')
    .subtract(18, 'years')
    .toISOString();

  minDateTime = moment(new Date(), 'YYYY-MM-DD')
    .subtract(70, 'years')
    .toISOString();

  genderOptions: any[] = [
    { name: 'N/A', value: '' },
    {
      name: this.multiLanguageService.instant(
        'customer.individual_info.gender_male'
      ),
      value: this.multiLanguageService.instant(
        'customer.individual_info.gender_male'
      ),
    },
    {
      name: this.multiLanguageService.instant(
        'customer.individual_info.gender_female'
      ),
      value: this.multiLanguageService.instant(
        'customer.individual_info.gender_female'
      ),
    },
    {
      name: this.multiLanguageService.instant(
        'customer.individual_info.gender_other'
      ),
      value: this.multiLanguageService.instant(
        'customer.individual_info.gender_other'
      ),
    },
  ];

  numberOfDependentsOptions: any = {
    fieldName: this.multiLanguageService.instant(
      'customer.individual_info.number_of_dependents'
    ),
    options: [
      {
        value: '0',
        title: '0',
      },
      {
        value: '1',
        title: '1',
      },
      {
        value: '2',
        title: '2',
      },
      {
        value: '3',
        title: '3',
      },
      {
        value: '4',
        title: '4',
      },
    ],
  };

  maritalStatusOptions = {
    fieldName: 'Tình trạng độc thân',
    options: [
      { name: 'N/A', value: '' },
      { name: 'Độc thân', value: 'Độc thân' },
      {
        name: 'Đã kết hôn',
        value: 'Đã kết hôn',
      },
      { name: 'Ly hôn', value: 'Ly hôn' },
      { name: 'Góa vợ/ chồng', value: 'Góa vợ/ chồng' },
    ],
  };

  bankNA = { bankCode: '', bankName: 'N/A' };

  constructor(
    private dialogRef: MatDialogRef<CustomerDetailUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder,
    private cityControllerService: CityControllerService,
    private districtControllerService: DistrictControllerService,
    private notifier: ToastrService
  ) {
    this.buildIndividualForm();

    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {
    // this.getAllCityList();
    // this.getCommuneList();
    // this.getDistrictList();
    this.banksFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
    // this.citiesFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterCities();
    //   });
    // this.districtsFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterDistricts();
    //   });
    // this.communesFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterCommunes();
    //   });
  }

  buildIndividualForm() {
    this.customerIndividualForm = this.formBuilder.group({
      id: [''],
      firstName: ['', [Validators.maxLength(250)]],
      mobileNumber: ['', [Validators.minLength(10), Validators.maxLength(12)]],
      email: ['', [Validators.email]],
      dateOfBirth: [''],
      gender: [''],
      identityNumberOne: [
        '',
        [Validators.minLength(9), Validators.maxLength(12)],
      ],
      addressTwoLine1: ['', [Validators.maxLength(250)]],
      // city: [''],
      // district: [''],
      // commune: [''],
      // apartmentNumber: ['', [Validators.maxLength(250)]],
      addressOneLine1: ['', [Validators.maxLength(250)]],
      idOrigin: ['', Validators.maxLength(250)],
      numberOfDependents: [''],
      maritalStatus: [''],
      accountNumber: [''],
      bankCode: [''],
      bankName: [''],
      vaAccountNumber: [''],
      createdAt: [''],
      updatedAt: [''],
    });
  }

  initDialogData(data: any) {
    this.customerInfo = data?.customerInfo;
    this.customerId = data?.customerId;
    this.virtualAccount = data?.virtualAccount;
    this.selfieSrc = data?.selfieSrc;
    this.bankOptions = data?.bankOptions ? data?.bankOptions : [];
    this.filteredBanks = data?.bankOptions ? data?.bankOptions : [];

    this.customerIndividualForm.patchValue({
      id: this.customerId,
      firstName: this.customerInfo?.firstName,
      mobileNumber: this.customerInfo?.mobileNumber,
      email: this.customerInfo?.emailAddress,
      dateOfBirth: this.formatDateToDisplay(this.customerInfo?.dateOfBirth),
      gender: this.customerInfo?.gender || '',
      identityNumberOne: this.customerInfo?.identityNumberOne,
      addressTwoLine1: this.customerInfo?.addressTwoLine1,
      // city: this.customerInfo?.city,
      // district: this.customerInfo?.district,
      // commune: this.customerInfo?.commune,
      // apartmentNumber: this.customerInfo?.apartmentNumber,
      addressOneLine1: this.customerInfo?.addressOneLine1,
      idOrigin: this.customerInfo?.idOrigin,
      numberOfDependents: this.customerInfo?.borrowerDetailTextVariable1 || '',
      maritalStatus: this.customerInfo?.maritalStatus || '',
      accountNumber: this.customerInfo?.accountNumber || null,
      bankCode: this.customerInfo?.bankCode || '',
      bankName: this.customerInfo?.bankName || '',
      vaAccountNumber: this.virtualAccount?.accountNumber || null,
      createdAt: this.customerInfo?.createdAt
        ? this.formatTime(this.customerInfo?.createdAt)
        : null,
      updatedAt: this.customerInfo?.updatedAt
        ? this.formatTime(this.customerInfo?.updatedAt)
        : null,
    });
  }

  submitForm() {
    this.customerIndividualForm.markAllAsTouched();

    if (this.customerIndividualForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.customerIndividualForm.getRawValue(),
    });
  }

  formatTime(time) {
    if (!time) return;
    return moment(new Date(time), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY HH:mm'
    );
  }

  formatDateToDisplay(date) {
    let formatDate = moment(date, ['DD-MM-YYYY', 'DD/MM/YYYY']).format(
      'YYYY-DD-MM HH:mm:ss'
    );
    return moment(formatDate, 'YYYY-DD-MM').toISOString();
  }

  changeBank(event) {
    if (!event.value) {
      return;
    }
    let seletedBank = this.bankOptions.filter(
      (bank) => bank.bankCode === event.value
    );
    this.customerIndividualForm.controls.bankName.setValue(
      seletedBank[0].bankName
    );
  }

  // getAllCityList() {
  //   this.subManager.add(
  //     this.cityControllerService
  //       .getAllCity()
  //       .subscribe((result: ApiResponseListCity) => {
  //         if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
  //           return this.notifier.error(
  //             JSON.stringify(result?.message),
  //             result?.errorCode
  //           );
  //         }
  //         this.cityData = result.result;
  //         this.filteredCities = result.result;
  //       })
  //   );
  // }

  // getDistrictList() {
  //   if (this.customerIndividualForm.controls.cityId.value === null) {
  //     return;
  //   }
  //   this.subManager.add(
  //     this.cityControllerService
  //       .getDistrictsByCityId(this.customerIndividualForm.controls.cityId.value)
  //       .subscribe((result: ApiResponseListDistrict) => {
  //         if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
  //           return this.notifier.error(
  //             JSON.stringify(result?.message),
  //             result?.errorCode
  //           );
  //         }
  //         this.districtData = result.result;
  //         this.filteredDistricts = result.result;
  //       })
  //   );
  // }

  // getCommuneList() {
  //   if (this.customerIndividualForm.controls.districtId.value === null) {
  //     return;
  //   }
  //   this.subManager.add(
  //     this.districtControllerService
  //       .getCommunesByDistrictId(
  //         this.customerIndividualForm.controls.districtId.value
  //       )
  //       .subscribe((result: ApiResponseListDistrict) => {
  //         if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
  //           return this.notifier.error(
  //             JSON.stringify(result?.message),
  //             result?.errorCode
  //           );
  //         }
  //         this.communeData = result.result;
  //         this.filteredCommunes = result.result;
  //       })
  //   );
  // }
  //
  // changeCity() {
  //   this.getDistrictList();
  //   this.customerIndividualForm.patchValue({ districtId: '' });
  //   this.communeData = [];
  //   this.filteredCommunes = [];
  // }
  //
  // toggleSelect() {
  //   if (!this.customerIndividualForm.controls.cityId.value) {
  //     return;
  //   }
  //   if (this.filteredCities && this.filteredCities.length === 0) {
  //     this.customerIndividualForm.patchValue({
  //       cityId: '',
  //       districtId: '',
  //       communeId: '',
  //     });
  //   }
  //   if (this.filteredDistricts && this.filteredDistricts.length === 0) {
  //     this.customerIndividualForm.patchValue({
  //       districtId: '',
  //       communeId: '',
  //     });
  //   }
  //   if (this.filteredCommunes && this.filteredCommunes.length === 0) {
  //     this.customerIndividualForm.patchValue({
  //       communeId: '',
  //     });
  //   }
  // }

  filterBanks() {
    let search = this.banksFilterCtrl.value;
    if (!search) {
      this.filteredBanks = this.bankOptions;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanks = this.bankOptions.filter(
      (bank) =>
        bank.bankCode.toLowerCase().indexOf(search) > -1 ||
        bank.bankName.toLowerCase().indexOf(search) > -1
    );
  }

  // filterCities() {
  //   let search = this.citiesFilterCtrl.value;
  //   if (!search) {
  //     this.filteredCities = this.cityData;
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredCities = this.cityData.filter(
  //     (city) => city.name.toLowerCase().indexOf(search) > -1
  //   );
  // }

  // changeDistrict() {
  //   this.getCommuneList();
  //   this.customerIndividualForm.patchValue({ communeId: '' });
  // }
  //
  // filterDistricts() {
  //   let search = this.districtsFilterCtrl.value;
  //   if (!search) {
  //     this.filteredDistricts = this.districtData;
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredDistricts = this.districtData.filter(
  //     (district) => district.name.toLowerCase().indexOf(search) > -1
  //   );
  // }
  //
  // filterCommunes() {
  //   let search = this.communesFilterCtrl.value;
  //   if (!search) {
  //     this.filteredCommunes = this.communeData;
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredCommunes = this.communeData.filter(
  //     (commune) => commune.name.toLowerCase().indexOf(search) > -1
  //   );
  // }
}
