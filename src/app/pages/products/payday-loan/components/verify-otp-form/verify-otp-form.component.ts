import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PermissionConstants } from '../../../../../core/common/constants/permission-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-verify-otp-form',
  templateUrl: './verify-otp-form.component.html',
  styleUrls: ['./verify-otp-form.component.scss'],
})
export class VerifyOtpFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() mobile: string;
  @Input() showSubmitButton: boolean = true;
  @Input() errorText: string;
  @Input() otpValue: any = [];
  @Input() disabled: boolean = false;
  @Output() verifyOtp = new EventEmitter<string>();

  @Output() resendOtp = new EventEmitter<string>();

  verifyOtpForm: FormGroup;

  otp: string;
  disableBtnNext: boolean = true;
  countdownTime: number = environment.RESEND_OTP_COUNTDOWN_TIME;
  intervalTime: any;
  hiddenCountdown: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.verifyOtpForm = this.formBuilder.group({
      otp: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.countdownTimer(this.countdownTime);
  }

  submit() {
    if (this.disableBtnNext) return;
    this.verifyOtp.emit(this.otp);
  }

  resendOtpClick() {
    this.resendOtp.emit(this.mobile);
    this.otp = null;
    this.resetCountdownTimer();
  }

  resetCountdownTimer() {
    this.hiddenCountdown = false;
    this.countdownTimer(this.countdownTime);
    this.cdr.detectChanges();
  }

  handleOnComplete(value) {
    this.otp = value;
    this.disableBtnNext = false;
    if (!this.showSubmitButton) {
      this.submit();
      return;
    }
    document.getElementById('btn-next-form-signing-otp').focus();
  }

  handleOnChange(value) {
    this.otp = value;
    this.disableBtnNext = true;
  }

  countdownTimer(second) {
    let duration = moment.duration(second * 1000, 'milliseconds');
    let interval = 1000;
    let intervalProcess = (this.intervalTime = setInterval(() => {
      duration = moment.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      document.getElementById('signing-otp-countdown-timer').textContent =
        duration.asSeconds() + 's';
      if (duration.asSeconds() == 0) {
        clearInterval(intervalProcess);
        this.hiddenCountdown = true;
      }
    }, interval));
  }

  destroyCountdownTimer() {
    clearInterval(this.intervalTime);
  }

  ngOnDestroy(): void {
    this.destroyCountdownTimer();
  }
}
