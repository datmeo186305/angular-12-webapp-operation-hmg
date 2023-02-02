import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../core/common/animations/router.animation';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import * as fromActions from "../../core/store/actions";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [
    fadeAnimation,
    // animation triggers go here
  ],
})
export class MainLayoutComponent implements OnInit {
  customerId$: Observable<string>;
  accessToken$: Observable<string>;
  loadingStatus$: Observable<boolean>;

  customerId: string;
  accessToken: string;

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {
    this._initSubscribeState();
    this.loadingStatus$ = this.store.select(fromStore.getLoadingStatus);
  }

  async ngOnInit() {
    await this.multiLanguageService.changeLanguage('vi');
    await this.multiLanguageService.use('vi');
    await this.initCustomerState();
  }

  initCustomerState() {
    if (this.accessToken) {
      this.store.dispatch(new fromStore.GetCustomerInfo(this.customerId));
      this.store.dispatch(new fromActions.GetCommonInfo(null));
    }
  }

  _initSubscribeState() {
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.accessToken$ = this.store.select(fromStore.getTokenState);

    this.subManager.add(
      this.customerId$.subscribe((customerId: string) => {
        this.customerId = customerId;
      })
    );

    this.subManager.add(
      this.accessToken$.subscribe((accessToken: any) => {
        this.accessToken = accessToken;
      })
    );
  }
}
