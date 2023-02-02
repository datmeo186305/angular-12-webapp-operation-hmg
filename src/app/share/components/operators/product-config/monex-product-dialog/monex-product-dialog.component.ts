import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-monex-product-dialog',
  templateUrl: './monex-product-dialog.component.html',
  styleUrls: ['./monex-product-dialog.component.scss'],
})
export class MonexProductDialogComponent implements OnInit {
  // Fixed Data
  workflows = [];
  pdModels = [];

  // matrices = [
  //   {
  //     name: 'Limit Control Matrix 1',
  //   },
  //   {
  //     name: 'Limit Control Matrix 2',
  //   },
  //   {
  //     name: 'Limit Control Matrix 3',
  //   },
  // ];

  // contracts = [
  //   {
  //     name: 'Hợp đồng 1',
  //   },
  //   {
  //     name: 'Hợp đồng 2',
  //   },
  //   {
  //     name: 'Hợp đồng 3',
  //   },
  // ];

  mifos = [];
  form: FormGroup;
  dialogTitle: string;
  input1Focus: boolean = false;
  input2Focus: boolean = false;
  input3Focus: boolean = false;
  info;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MonexProductDialogComponent>,
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
      status: true,
      workflow: [''],
      pdModel: [''],
      // matrix: [''],
      // contract: [''],
      mifos: [''],
    });
  }

  initDialogData(data) {
    this.dialogTitle = data?.dialogTitle;
    this.workflows = data?.workflows;
    this.pdModels = data?.pdModels;
    this.mifos = data?.mifos;
    this.info = data?.info;
    let status = data?.info?.status === 'ACTIVE';

    if (data.info) {
      this.form.patchValue({
        code: this.info?.code,
        name: this.info?.name,
        description: this.info?.description,
        status: true,
        workflow: this.info?.statusGroup?.id,
        pdModel: this.info.pdModels.map((pdModel) => pdModel.id),
        mifos: this.info?.mifosProductId,
        // matrix: this.info?.matrix,
        // contract: this.info?.contract,
        // mifos: this.info?.mifos,
      });
    }
  }

  getModelName(id) {
    if (id[0]) {
      return this.pdModels.filter((pdmodel) => pdmodel.id === id[0])[0].name;
    } else {
      return '';
    }
  }

  submitForm() {
    if (this.form.controls.status.value) {
      this.form.patchValue({
        code: 'MXP',
        status: 'ACTIVE',
      });
    } else {
      this.form.patchValue({
        code: 'MXP',
        status: 'INACTIVE',
      });
    }
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
