import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from './../../../core/store';
import * as fromActions from './../../../core/store';
import { Title } from '@angular/platform-browser';
import { PermissionConstants } from '../../../core/common/constants/permission-constants';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  isUsernameInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;

  isPassVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<fromStore.State>,
    private titleService: Title,
    private multiLanguageService: MultiLanguageService
  ) {
    this.signInForm = this.formBuilder.group({
      username: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   this.multiLanguageService.instant('page_title.sign_in') +
    //     ' - ' +
    //     environment.PROJECT_NAME
    // );
    this.resetSession();
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      return;
    }

    const username = this.signInForm.controls.username.value;
    const password = this.signInForm.controls.password.value;

    this.store.dispatch(new fromActions.Signin({ username, password }));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }
}
