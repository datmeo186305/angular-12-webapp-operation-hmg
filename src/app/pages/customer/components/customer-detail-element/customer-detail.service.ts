import { Injectable } from '@angular/core';
import {
  InfoControllerService,
  UpdateInfoRequest,
} from 'open-api-modules/customer-api-docs';
import { FileControllerService } from '../../../../../../open-api-modules/com-api-docs';
import { CustomerControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerDetailService {
  constructor(
    private customerControllerService: CustomerControllerService,
    private fileControllerService: FileControllerService,
    private customerService: InfoControllerService,
    private domSanitizer: DomSanitizer
  ) {}

  public getById(id) {
    return this.customerControllerService.getCustomerById(id).pipe(
      map((results) => {
        return results;
      }),

      catchError((err) => {
        throw err;
      })
    );
  }

  public returnCustomerToConfirmInformationPage(customerId: string) {
    return this.customerService.returnConfirmInformation(customerId).pipe(
      map((results) => {
        return results;
      }),

      catchError((err) => {
        throw err;
      })
    );
  }

  public downloadSingleFileDocument(customerId: string, documentPath: string) {
    if (sessionStorage.getItem(documentPath)) {
      return of(
        this.domSanitizer.bypassSecurityTrustUrl(
          sessionStorage.getItem(documentPath)
        )
      );
    }
    return this.fileControllerService
      .downloadFile({ customerId, documentPath })
      .pipe(
        map((results) => {
            const imageUrl = this.convertBlobType(results, 'application/image');
            sessionStorage.setItem(documentPath, imageUrl);
            return this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
        }),
        // catch errors
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  public convertBlobType(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    return url;
  }

  public downloadFileDocument(customerId: string, documentPath: string) {
    return this.fileControllerService
      .downloadFile({ customerId, documentPath })
      .pipe(
        map((results) => {
          let imageType = documentPath.split('.').pop();
          if (imageType === 'jpg') {
            imageType = 'jpeg';
          }
          const imageUrl = this.convertBlobType(results, `image/${imageType}`);
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('href', imageUrl);
          a.setAttribute('download', imageUrl.split('/').pop());
          document.body.appendChild(a);
          a.click();
          a.remove();
        }),
        // catch errors
        catchError((err) => {
          return of(null);
        })
      );
  }

  public uploadFileDocument(
    documentType: string,
    file,
    customerId: string,
    observe?: any,
    reportProgress?: boolean
  ) {
    return this.fileControllerService
      .uploadSingleFile(documentType, file, customerId, observe, reportProgress)
      .pipe(
        map((results) => {
          return results;
        }),
        // catch errors
        catchError((err) => {
          return of(null);
        })
      );
  }

  public updateCustomerInfo(
    customerId: string,
    updateInfoRequest: Object,
    observe?: any,
    reportProgress?: boolean
  ) {
    const infoData: UpdateInfoRequest = {
      info: {},
    };
    for (const key in updateInfoRequest) {
      infoData.info[key] = updateInfoRequest[key]
        ? new Object(updateInfoRequest[key])
        : null;
    }

    return this.customerService
      .updateInfo(customerId, infoData, observe, reportProgress)
      .pipe(
        map((results) => {
          return results;
        }),
        catchError((err) => {
          return of(null);
        })
      );
  }
}
