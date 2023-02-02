import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-product-workflow-dialog',
  templateUrl: './product-workflow-dialog.component.html',
  styleUrls: ['./product-workflow-dialog.component.scss'],
})
export class ProductWorkflowDialogComponent implements OnInit {
  leftArr = [];
  rightArr = [];
  originalRightArr = [];
  leftTemp = [];
  rightTemp = [];
  addArr = [];
  updateArr = [];
  removeArr = [];

  form: FormGroup;
  info;

  dialogTitle: string;
  isAccountNameInputFocus: boolean = false;
  isCodeInputFocus: boolean = false;
  isLoginInputFocus: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ProductWorkflowDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildForm() {
    this.form = this.formBuilder.group({
      code: [''],
      name: [''],
      description: [''],
      status: '',
      addArr: [''],
      updateArr: [''],
      removeArr: [''],
    });
  }

  initDialogData(data) {
    this.info = data?.info;
    this.dialogTitle = data?.dialogTitle;
    this.leftArr = data?.leftArr;
    if (data?.rightArr) {
      this.rightArr = data?.rightArr.sort((a, b) => {
        return a.order - b.order;
      });
    }
    this.originalRightArr = data?.rightArr;
    let status: boolean = true;
    if (data?.info?.status !== undefined) {
      status = data?.info?.status === 'ACTIVE';
    }

    this.form.patchValue({
      code: this.info?.code,
      name: this.info?.name,
      description: this.info?.description,
      status: status,
    });
  }

  giveOrders() {
    let orderedArr = [];
    orderedArr.push(
      this.rightArr.map((ele, index) => {
        return {
          id: ele.id,
          name: ele.name,
          order: index,
        };
      })
    );
    this.bindElementToArray(orderedArr[0]);
  }

  bindElementToArray(orderedArr) {
    if (this.originalRightArr) {
      // Get add elements
      let addIds = this.originalRightArr.map((ele) => ele.id);
      this.addArr = orderedArr.filter((ele) => !addIds.includes(ele.id));

      // Get update elements
      this.updateArr = orderedArr.filter((ele) => addIds.includes(ele.id));

      // Get remove elements
      let removeIds = orderedArr.map((ele) => ele.id);
      this.removeArr = this.originalRightArr.filter(
        (ele) => !removeIds.includes(ele.id)
      );
    } else {
      this.addArr = orderedArr;
    }
  }

  submitForm() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.giveOrders();

    if (this.form.controls.status.value) {
      this.form.patchValue({
        code: 'PW',
        status: 'ACTIVE',
        addArr: this.addArr,
        updateArr: this.updateArr,
        removeArr: this.removeArr,
      });
    } else {
      this.form.patchValue({
        code: 'PW',
        status: 'INACTIVE',
        addArr: this.addArr,
        updateArr: this.updateArr,
        removeArr: this.removeArr,
      });
    }

    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.form.getRawValue(),
    });
  }

  onClickQuestion(event, question) {
    event.target.classList.toggle('gray');
    if (this.leftTemp.includes(question)) {
      const index = this.leftTemp.indexOf(question);
      this.leftTemp.splice(index, 1);
    } else {
      this.leftTemp.push(question);
    }
  }

  onClickChosenQuestion(event, question) {
    event.target.classList.toggle('gray');
    if (this.rightTemp.includes(question)) {
      const index = this.rightTemp.indexOf(question);
      this.rightTemp.splice(index, 1);
    } else {
      this.rightTemp.push(question);
    }
  }

  moveToRight() {
    this.rightArr = this.rightArr.concat(this.leftTemp);
    const tempSet = new Set(this.leftTemp);
    this.leftArr = this.leftArr.filter((question) => {
      return !tempSet.has(question);
    });
    this.leftTemp = [];
  }

  moveToLeft() {
    this.leftArr = this.leftArr.concat(this.rightTemp);
    const tempSet = new Set(this.rightTemp);
    this.rightArr = this.rightArr.filter((question) => {
      return !tempSet.has(question);
    });
    this.rightTemp = [];
  }
}
