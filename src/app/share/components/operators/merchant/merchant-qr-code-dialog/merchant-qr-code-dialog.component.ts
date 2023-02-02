import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import {Merchant} from "../../../../../../../open-api-modules/dashboard-api-docs";

@Component({
  selector: 'app-merchant-qr-code-dialog',
  templateUrl: './merchant-qr-code-dialog.component.html',
  styleUrls: ['./merchant-qr-code-dialog.component.scss'],
})
export class MerchantQrCodeDialogComponent implements OnInit {
  dialogTitle: string = this.multiLanguageService.instant(
    'merchant.merchant_dialog.qr_code'
  );
  merchantInfo: Merchant;
  merchantQr: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MerchantQrCodeDialogComponent>,
    private multiLanguageService: MultiLanguageService
  ) {
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  initDialogData(data) {
    this.merchantInfo = data?.merchantInfo;
    this.merchantQr = data?.merchantQr;
  }

  public printQr() {
    // Create a fake iframe
    const iframe = document.createElement('iframe');

    // Make it hidden
    iframe.name = "printframe";
    iframe.style.height = String(100);
    iframe.style.visibility = 'hidden';
    iframe.style.width = String(100);

    // Set the iframe's source
    iframe.setAttribute('srcdoc', '<html><body></body></html>');

    document.body.appendChild(iframe);

    iframe.contentWindow.addEventListener('afterprint', function () {
      iframe.parentNode.removeChild(iframe);
    });

    iframe.addEventListener('load',  () => {
      // Clone the image
      const image = document.getElementById('merchant-qr-code').cloneNode(true);

      // Append the style to the iframe's head
      const head = iframe.contentDocument.head;

      let stylePrint = document.createElement("style");
      stylePrint.type = "text/css";
      stylePrint.textContent = "@media Print {body {transform:scale(1)}} @page{margin-left: 0cm;} body {margin-left:0;padding:0;};";

      let styleContent = document.createElement("style");
      styleContent.type = "text/css";
      styleContent.textContent = "";

      head.appendChild(stylePrint);
      head.appendChild(styleContent);

      // Append the image to the iframe's body
      const body = iframe.contentDocument.body;

      body.style.textAlign = 'center';
      body.appendChild(image);

      iframe.contentDocument.title = this.merchantInfo?.name;
      iframe.title = this.merchantInfo?.name;

      setTimeout(function () {
        window.frames["printframe"].focus();
        window.frames["printframe"].print();
      }, 1500);
    });
  }

}
