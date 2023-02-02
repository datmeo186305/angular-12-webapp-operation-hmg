import { Component, OnInit } from '@angular/core';
import { MultiLanguageService } from './share/translate/multiLanguageService';
import { fadeAnimation } from './core/common/animations/router.animation';
import { NgxPermissionsService } from 'ngx-permissions';
import {
  ApiResponseListString,
  PermissionControllerService,
} from '../../open-api-modules/identity-api-docs';
import * as fromStore from './core/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RESPONSE_CODE } from './core/common/enum/operator';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeAnimation,
    // animation triggers go here
  ],
})
export class AppComponent implements OnInit {
  title = 'monex-op';

  accessToken: string;
  accessToken$: Observable<string>;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private permissionsService: NgxPermissionsService,
    private permissionControllerService: PermissionControllerService,
    private store: Store<fromStore.State>,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    sessionStorage.clear();
    this.multiLanguageService.changeLanguage('vi');
    // this.multiLanguageService.onSetupMultiLanguage('payment');
    this._initSubscribeState();
  }

  private _initSubscribeState() {
    this.accessToken$ = this.store.select(fromStore.getTokenState);
    this.accessToken$.subscribe((accessToken: any) => {
      this.accessToken = accessToken;
      if (accessToken) {
        this._loadUserPermissions();
      }
    });
  }

  private _loadUserPermissions() {
    this.permissionControllerService
      .getPermissionsByAccount()
      .subscribe((response: ApiResponseListString) => {
        if (
          !response ||
          !response.result ||
          response.responseCode !== RESPONSE_CODE.SUCCESS
        ) {
          return;
        }
        this.permissionsService.loadPermissions(response.result);
      });
  }

  ngOnInit(): void {
    this.setBrowserTabTitle();
  }

  private setBrowserTabTitle(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => this.getRouteFirstChild(route)),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) =>
        this.titleService.setTitle(this.buildTitle(event['title']))
      );
  }

  private getRouteFirstChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

  private buildTitle(pageTitle: string): string {
    if (pageTitle) {
      return [pageTitle, environment.PROJECT_NAME].join(
        environment.BROWSER_TAB_TITLE_DELIMITER
      );
    }

    return environment.PROJECT_NAME;
  }
}
