import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';

@Component({
  selector: 'app-merchant-group-dialog',
  templateUrl: './merchant-group-dialog.component.html',
  styleUrls: ['./merchant-group-dialog.component.scss'],
})
export class MerchantGroupDialogComponent implements OnInit {
  merchantGroupForm: FormGroup;
  merchantGroupInfo;
  dialogTitle: string = this.multiLanguageService.instant(
    'merchant.merchant_dialog.add_group_title'
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MerchantGroupDialogComponent>,
    private formBuilder: FormBuilder,
    private multiLanguageService: MultiLanguageService
  ) {
    this.buildMerchantGroupForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildMerchantGroupForm() {
    this.merchantGroupForm = this.formBuilder.group({
      merchantGroupName: [''],
      merchantGroupNote: [''],
    });
  }

  initDialogData(data) {
    this.merchantGroupInfo = data?.merchantGroupInfo;
    this.dialogTitle = data?.dialogTitle;

    this.merchantGroupForm.patchValue({
      merchantGroupName: this.merchantGroupInfo.title,
      merchantGroupNote: this.merchantGroupInfo.note,
    });
  }
}
