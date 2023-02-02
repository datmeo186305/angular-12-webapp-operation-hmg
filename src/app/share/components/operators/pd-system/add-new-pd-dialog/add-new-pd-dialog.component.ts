import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-pd-dialog',
  templateUrl: './add-new-pd-dialog.component.html',
  styleUrls: ['./add-new-pd-dialog.component.scss'],
})
export class AddNewPdDialogComponent implements OnInit {
  //Mock data
  leftArr = [];
  rightArr = [];
  originalRightArr = [];
  leftTemp = [];
  rightTemp = [];
  addArr = [];
  updateArr = [];
  removeArr = [];

  addPdForm: FormGroup;
  pdInfo;

  isPdGroup: boolean;
  isAccountNameInputFocus: boolean = false;
  isLoginInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;
  isRePasswordInputFocus: boolean = false;
  isRoleInputFocus: boolean = false;
  isPhoneInputFocus: boolean = false;
  isEmailInputFocus: boolean = false;
  isPositionInputFocus: boolean = false;
  isNoteInputFocus: boolean = false;
  dialogTitle: string;
  inputCode: string;
  listTitle: string;
  inputName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddNewPdDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildAccountInfoForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildAccountInfoForm() {
    this.addPdForm = this.formBuilder.group({
      formName: [''],
      code: [''],
      content: [''],
      description: [''],
      status: '',
      addArr: [''],
      updateArr: [''],
      removeArr: [''],
    });
  }

  initDialogData(data) {
    this.pdInfo = data?.pdInfo;
    this.dialogTitle = data?.dialogTitle;
    this.inputName = data?.inputName;
    this.inputCode = data?.inputCode;
    this.listTitle = data?.listTitle;
    this.isPdGroup = data?.isPdGroup;
    this.leftArr = data?.leftArr;
    if (data?.rightArr) {
      this.rightArr = data?.rightArr.sort((a, b) => {
        return a.order - b.order;
      });
    }
    this.originalRightArr = data?.rightArr;
    let status: boolean = true;
    if (data?.pdInfo?.status !== undefined) {
      status = data?.pdInfo?.status === 'ACTIVE';
    }

    this.addPdForm.patchValue({
      formName: data?.isPdGroup ? 'PDGroup' : 'PDModel',
      code: this.pdInfo?.code,
      content: this.pdInfo?.content,
      description: this.pdInfo?.description,
      status: status,
    });
  }

  giveOrders() {
    let orderedArr = [];
    orderedArr.push(
      this.rightArr.map((ele, index) => {
        return {
          id: ele.id,
          content: ele.content,
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
    this.giveOrders();

    this.addPdForm.markAllAsTouched();

    if (this.addPdForm.invalid) {
      return;
    }
    if (this.addPdForm.controls.status.value) {
      this.addPdForm.patchValue({
        status: 'ACTIVE',
        addArr: this.addArr,
        updateArr: this.updateArr,
        removeArr: this.removeArr,
      });
    } else {
      this.addPdForm.patchValue({
        status: 'INACTIVE',
        addArr: this.addArr,
        updateArr: this.updateArr,
        removeArr: this.removeArr,
      });
    }
    if (this.addPdForm.controls.formName.value === 'PDModel') {
      this.addPdForm.patchValue({
        code: 'PDM',
      });
    } else {
      this.addPdForm.patchValue({
        code: 'PDG',
      });
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.addPdForm.getRawValue(),
    });
  }

  onClickLeft(event, question) {
    event.target.classList.toggle('gray');
    if (this.leftTemp.includes(question)) {
      const index = this.leftTemp.indexOf(question);
      this.leftTemp.splice(index, 1);
    } else {
      this.leftTemp.push(question);
    }
  }

  onClickRight(event, question) {
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
