import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerInfo } from '../../../../../../open-api-modules/dashboard-api-docs';

@Component({
  selector: 'app-customer-note',
  templateUrl: './customer-note.component.html',
  styleUrls: ['./customer-note.component.scss'],
})
export class CustomerNoteComponent implements OnInit {
  customerNoteForm: FormGroup;
  _customerInfo;
  @Output() triggerUpdateInfo = new EventEmitter<any>();

  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._customerInfo = value;
    this._initNoteFormData(value);
  }

  constructor(private formBuilder: FormBuilder) {
    this.customerNoteForm = this.formBuilder.group({
      note: [''],
    });
  }

  ngOnInit(): void {}

  submitForm() {
    const data = this.customerNoteForm.getRawValue();
    this.triggerUpdateInfo.emit({
      'personalData.note': data.note,
    });
  }

  private _initNoteFormData(customerInfo) {
    this.customerNoteForm.patchValue({
      note: customerInfo?.note,
    });
  }
}
