import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bnpl-note',
  templateUrl: './bnpl-note.component.html',
  styleUrls: ['./bnpl-note.component.scss'],
})
export class BnplNoteComponent implements OnInit {
  loanInfoForm: FormGroup;
  @Output() triggerUpdateLoanInfo = new EventEmitter<any>();

  _loanDetail: any;
  @Input()
  get loanDetail(): any {
    return this._loanDetail;
  }

  set loanDetail(value: any) {
    this._loanDetail = value;
    this._initLoanInfoData();
  }

  constructor(private formBuilder: FormBuilder) {
    this.loanInfoForm = this.formBuilder.group({
      note: [''],
    });
  }

  ngOnInit(): void {}

  private _initLoanInfoData() {
    this.loanInfoForm.patchValue({
      note: this.loanDetail?.note,
    });
  }

  submitForm() {
    this.loanInfoForm.markAllAsTouched();

    if (this.loanInfoForm.invalid) return;
    this.triggerUpdateLoanInfo.emit({
      id: this.loanDetail?.id,
      note: this.loanInfoForm.controls.note.value,
    });
  }
}
