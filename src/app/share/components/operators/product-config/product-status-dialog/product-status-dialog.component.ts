import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-product-status-dialog',
  templateUrl: './product-status-dialog.component.html',
  styleUrls: ['./product-status-dialog.component.scss'],
})
export class ProductStatusDialogComponent implements OnInit {
  form: FormGroup;
  dialogTitle: string;
  isAccountNameInputFocus: boolean = false;
  isLoginInputFocus: boolean = false;
  isCodeInputFocus: boolean = false;
  info;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ProductStatusDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      code: [''],
      name: [''],
      description: [''],
    });
  }

  initDialogData(data) {
    this.dialogTitle = data?.dialogTitle;
    this.info = data?.info;
    let status = data?.info?.status === 'ACTIVE';

    this.form.patchValue({
      code: this.info?.code,
      name: this.info?.name,
      description: this.info?.description,
    });
  }

  submitForm() {
    // if (this.form.controls.status.value) {
    //   this.form.patchValue({
    //     status: 'ACTIVE',
    //   });
    // }
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.form.getRawValue(),
    });
  }

  ngOnInit(): void {}
}
