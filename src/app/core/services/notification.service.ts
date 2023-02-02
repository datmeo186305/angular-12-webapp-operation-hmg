import { Injectable } from '@angular/core';
import {
  FullsizeImageDialogComponent,
  PlLoadingComponent,
  PlPromptComponent,
} from '../../share/components';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Prompt } from '../../public/models/external/prompt.model';
import { PlLoading } from 'src/app/public/models/external/plloading.model';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';
import { FullsizeImgModel } from '../../public/models/external/fullsizeImg.model';
import { Store } from '@ngrx/store';
import * as fromStore from '../store';
import * as fromActions from '../../core/store';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  subManager = new Subscription();

  constructor(
    private dialog: MatDialog,
    private loadingDialogRef: MatDialogRef<PlLoadingComponent>,
    private promptDialogRef: MatDialogRef<PlPromptComponent>,
    private fullsizeImgDialogRef: MatDialogRef<FullsizeImageDialogComponent>,
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>
  ) {}

  openImgFullsizeDiaglog(
    payload: FullsizeImgModel
  ): MatDialogRef<FullsizeImageDialogComponent> {
    return this.dialog.open(FullsizeImageDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      maxWidth: '100vw',
      data: {
        imageSrc: payload?.imageSrc,
      },
    });
  }

  openErrorModal(payload: Prompt): MatDialogRef<PlPromptComponent> {
    return this.openPrompt({
      ...payload,
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
    });
  }

  openSuccessModal(payload: Prompt): MatDialogRef<PlPromptComponent> {
    return this.openPrompt({
      ...payload,
      imgUrl: 'assets/img/payday-loan/success-prompt-icon.png',
    });
  }

  openPrompt(payload: Prompt): MatDialogRef<PlPromptComponent> {
    this.promptDialogRef = this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '184px',
      maxWidth: '330px',
      data: {
        imgBackgroundClass: payload?.imgBackgroundClass
          ? payload?.imgBackgroundClass + ' text-center'
          : 'text-center',
        imgUrl: !payload?.imgGroupUrl ? payload?.imgUrl : null,
        imgGroupUrl: payload?.imgGroupUrl || null,
        title: payload?.title,
        content: payload?.content,
        primaryBtnText: payload?.primaryBtnText,
        primaryBtnClass: payload?.primaryBtnClass,
        secondaryBtnText: payload?.secondaryBtnText,
        secondaryBtnClass: payload?.secondaryBtnClass,
      },
    });
    return this.promptDialogRef;
  }

  openLoadingDialog(payload?: PlLoading): MatDialogRef<PlLoadingComponent> {
    this.loadingDialogRef = this.dialog.open(PlLoadingComponent, {
      panelClass: payload?.showContent
        ? 'custom-dialog-container'
        : 'hide-content-dialog',
      height: 'auto',
      minHeight: '194px',
      maxWidth: '290px',
      disableClose: true,
      data: {
        title:
          payload?.title ||
          this.multiLanguageService.instant('common.loading_title'),
        content:
          payload?.content ||
          this.multiLanguageService.instant('common.loading_content'),
        showContent: payload?.showContent,
      },
    });

    return this.loadingDialogRef;
  }

  closeLoadingDialog() {
    if (!this.loadingDialogRef) {
      return;
    }
    this.loadingDialogRef.close('hideLoading');
  }

  showLoading(payload?: PlLoading) {
    this.store.dispatch(
      new fromActions.SetLoadingStatus({
        showLoading: true,
        loadingContent: payload,
      })
    );
  }

  hideLoading() {
    this.store.dispatch(new fromActions.ResetLoadingStatus());
  }

  destroyAllDialog() {
    this.dialog.closeAll();
  }

  hidePrompt() {
    this.promptDialogRef.close('hidePrompt');
  }
}
