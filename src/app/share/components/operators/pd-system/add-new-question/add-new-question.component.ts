import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-add-new-question',
  templateUrl: './add-new-question.component.html',
  styleUrls: ['./add-new-question.component.scss'],
})
export class AddNewQuestionComponent implements OnInit {
  answerTypes = [
    {
      name: 'String',
    },
    {
      name: 'Dropdown',
    },
    {
      name: 'DateTime',
    },
    {
      name: 'Checkbox',
    },
    {
      name: 'RadioButton',
    },
    {
      name: 'Slider',
    },
  ];

  addPdForm: FormGroup;
  oneAnswer: boolean = false;
  manyAnswers: boolean = false;
  sliderType: boolean = false;
  numAnswers: any[] = [
    {
      value: '',
    },
  ];
  sliderAnswers: any[] = [
    {
      value: '',
      placeHolder: 'MinNumber',
    },
    {
      value: '',
      placeHolder: 'MaxNumber',
    },
    {
      value: '',
      placeHolder: 'StepSize',
    },
    {
      value: '',
      placeHolder: 'Đơn vị',
    },
  ];

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
  questionInfo;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddNewQuestionComponent>,
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
      code: [''],
      content: [''],
      description: [''],
      answerType: [''],
      placeHolder: [''],
      answers: [''],
      isMandatory: false,
    });
  }

  initDialogData(data) {
    this.questionInfo = data?.questionInfo;
    this.dialogTitle = data?.dialogTitle;
    if (data?.questionInfo) {
      if (data?.questionInfo.answerType === 'Slider') {
        for (let i = 0; i < this.questionInfo.answers.length; i++) {
          this.sliderAnswers[i].value = this.questionInfo.answers[i];
        }
        this.sliderType = true;
      } else if (
        data?.questionInfo.answerType === 'String' ||
        data?.questionInfo.answerType === 'DateTime'
      ) {
        this.oneAnswer = true;
      } else {
        this.manyAnswers = true;
        this.numAnswers = this.questionInfo?.answers?.map((answer) => {
          return {
            value: answer,
          };
        });
      }
    }

    this.addPdForm.patchValue({
      code: this.questionInfo?.code,
      content: this.questionInfo?.content,
      description: this.questionInfo?.description,
      answerType: this.questionInfo?.answerType,
      placeHolder: this.questionInfo?.placeHolder,
      answers: this.questionInfo?.answers,
      isMandatory: this.questionInfo?.isMandatory,
    });
  }

  selectType(type) {
    if (type === 'String' || type === 'DateTime') {
      this.oneAnswer = true;
      this.manyAnswers = false;
      this.sliderType = false;
    } else if (type === 'Slider') {
      this.oneAnswer = false;
      this.manyAnswers = false;
      this.sliderType = true;
    } else {
      this.oneAnswer = false;
      this.manyAnswers = true;
      this.sliderType = false;
    }
  }

  addAnswer() {
    this.numAnswers.push({
      value: '',
    });
  }

  removeAnswer(i: number) {
    this.numAnswers.splice(i, 1);
  }

  getAnswersList() {
    let answers = [];
    let answerType = this.addPdForm.controls.answerType.value;
    if (answerType === 'Slider') {
      for (let i = 0; i < this.sliderAnswers.length; i++) {
        answers.push(this.sliderAnswers[i].value);
      }
    } else if (answerType === 'String' || answerType === 'DateTime') {
      answers = answers;
    } else {
      for (let i = 0; i < this.numAnswers?.length; i++) {
        answers.push(this.numAnswers[i].value);
      }
    }
    this.addPdForm.patchValue({
      code: 'PDQ',
      answers: answers,
    });
  }

  submitForm() {
    if (this.addPdForm.controls.isMandatory.value) {
      this.addPdForm.patchValue({
        isMandatory: true,
      });
    }

    this.getAnswersList();
    this.addPdForm.markAllAsTouched();

    if (this.addPdForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.addPdForm.getRawValue(),
    });
  }
}
