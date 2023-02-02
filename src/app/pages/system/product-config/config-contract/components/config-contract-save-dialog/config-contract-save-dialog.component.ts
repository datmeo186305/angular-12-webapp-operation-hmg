import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator/public-api';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
// import * as htmlToPdfmake from 'html-to-pdfmake';
// import pdfmake from 'pdfmake/build/pdfmake';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../../../environments/environment';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  RESPONSE_CODE,
  TABLE_ACTION_TYPE,
} from '../../../../../../core/common/enum/operator';
import { NotificationService } from '../../../../../../core/services/notification.service';
import * as fromStore from '../../../../../../core/store';
import * as fromSelectors from '../../../../../../core/store/selectors';
import { DisplayedFieldsModel } from '../../../../../../public/models/filter/displayed-fields.model';
import { MultiLanguageService } from '../../../../../../share/translate/multiLanguageService';
import { ConfigContractListService } from '../../config-contract-list/config-contract-list.service';
import { ContractTemplatesService } from './../../../../../../../../open-api-modules/monexcore-api-docs/api/contractTemplates.service';
import { BnplListService } from './../../../../../products/bnpl/bnpl-list/bnpl-list.service';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// @ts-ignore
// import pdfFonts from '../../../../../../public/vfs_fonts/vfs_custom_fonts';
import { DomSanitizer } from '@angular/platform-browser';
import { ContractTemplate } from '../../../../../../../../open-api-modules/monexcore-api-docs';
import { ToastrService } from 'ngx-toastr';

// pdfmake.vfs = pdfFonts.pdfMake.vfs;
//
// pdfmake.fonts = {
//   // Default font should still be available
//   Roboto: {
//     normal: 'Roboto-Regular.ttf',
//     bold: 'Roboto-Bold.ttf',
//     italics: 'Roboto-Italic.ttf',
//     bolditalics: 'Roboto-BoldItalic.ttf',
//   },
//   // Make sure you define all 4 components - normal, bold, italics, bolditalics - (even if they all point to the same font file)
//   Arial: {
//     normal: 'arial.ttf',
//     bold: 'arialbd.ttf',
//     italics: 'ariali.ttf',
//     bolditalics: 'arialbi.ttf',
//   },
//   TimesNewRoman: {
//     normal: 'times.ttf',
//     bold: 'timesbd.ttf',
//     italics: 'timesi.ttf',
//     bolditalics: 'timesbi.ttf',
//   },
//   Calibri: {
//     normal: 'calibri.ttf',
//     bold: 'calibrib.ttf',
//     italics: 'calibrii.ttf',
//     bolditalics: 'calibriz.ttf',
//   },
// };

@Component({
  selector: 'app-config-contract-save-dialog',
  templateUrl: './config-contract-save-dialog.component.html',
  styleUrls: ['./config-contract-save-dialog.component.scss'],
})
export class ConfigContractSaveDialogComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;
  @ViewChild('layout') canvasRef;
  contractTemplateForm: FormGroup;
  title: string;
  contractTemplate: ContractTemplate;
  action: TABLE_ACTION_TYPE;
  workflowStatuses: any[];
  loanProducts: any[];
  loanContractView: any;

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pageSize: number = 20;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;
  displayColumnRowDef: string[];
  subManager = new Subscription();
  accessToken$: Observable<string>;
  token: string;
  timeout: any;
  docPdf: any;

  displayColumns: DisplayedFieldsModel[] = [
    {
      key: 'orderNumber',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_property.order_number'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
      width: 50,
    },
    {
      key: 'code',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_property.code'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
      width: 100,
    },
    {
      key: 'description',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_property.description'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
      width: 100,
    },
    // {
    //   key: 'code',
    //   title: this.multiLanguageService.instant(
    //     'system.system_config.contract_property.code'
    //   ),
    //   type: DATA_CELL_TYPE.TEXT,
    //   format: null,
    //   showed: true,
    //   width: 100,
    // },
  ];

  ckeditorConfig: any = {
    extraPlugins:
      'image,dialogui,dialog,a11yhelp,about,basicstyles,bidi,blockquote,clipboard,' +
      'button,panelbutton,panel,floatpanel,colorbutton,colordialog,menu,' +
      'contextmenu,dialogadvtab,div,elementspath,enterkey,entities,popup,' +
      'filebrowser,find,fakeobjects,floatingspace,listblock,richcombo,' +
      'font,format,forms,horizontalrule,htmlwriter,iframe,indent,' +
      'indentblock,indentlist,justify,link,list,liststyle,magicline,' +
      'maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,' +
      'removeformat,resize,save,menubutton,scayt,selectall,showblocks,' +
      'showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,' +
      'tabletools,templates,toolbar,undo,wysiwygarea,exportpdf',
    font_names: 'Arial;Times New Roman;Roboto;',
    removePlugins: '',
    extraAllowedContent: 'code',
    filebrowserBrowseUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
    filebrowserUploadUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
    filebrowserImageUploadUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
    imageUploadUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
    uploadUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
  };
  productStatusFilterCtrl: FormControl = new FormControl();
  productFilterCtrl: FormControl = new FormControl();
  _onDestroy = new Subject<void>();
  filteredWorkflowStatuses: any[];
  filteredProducts: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfigContractSaveDialogComponent>,
    private formBuilder: FormBuilder,
    private multiLanguageService: MultiLanguageService,
    private configContractListService: ConfigContractListService,
    private store: Store<fromStore.State>,
    private notificationService: NotificationService,
    private domSanitizer: DomSanitizer,
    private notifier: ToastrService,
    private bnplServive: BnplListService,
    private monexCoreContractTemplateControllerService: ContractTemplatesService
  ) {
    this._getPropertiesContract();
    this._getListLoanProducts();
    this.displayColumnRowDef = this.displayColumns.map((ele) => ele.key);
    this.buildForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  ngOnInit(): void {
    this.accessToken$ = this.store.select(fromSelectors.getTokenState);
    this.accessToken$.subscribe((token) => {
      this.token = token;
    });
    this.productFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProducts();
      });

    this.productStatusFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterWorkflowStatuses();
      });
  }

  filterProducts() {
    let search = this.productFilterCtrl.value;

    if (!search) {
      this.filteredProducts = this.loanProducts;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProducts = this.loanProducts.filter(
      (product) => product.name.toLowerCase().indexOf(search) > -1
    );
  }

  filterWorkflowStatuses() {
    let search = this.productStatusFilterCtrl.value;
    console.log(this.productStatusFilterCtrl.value);
    if (!search) {
      this.filteredWorkflowStatuses = this.workflowStatuses;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredWorkflowStatuses = this.workflowStatuses.filter(
      (workflowStatus) =>
        workflowStatus.loanStatus?.name.toLowerCase().indexOf(search) > -1
    );
  }

  buildForm() {
    this.contractTemplateForm = this.formBuilder.group({
      name: ['', [Validators.maxLength(100)]],
      content: [''],
      statusFlowId: [''],
      productId: [''],
      isActive: [''],
      customerPositionPage: ['', [Validators.min(1), Validators.required]],
      monexPositionPage: ['', [Validators.min(1), Validators.required]],
      customerWidth: ['', [Validators.min(1), Validators.required]],
      customerHeight: ['', [Validators.min(1), Validators.required]],
      customerPositionX: ['', [Validators.required, Validators.min(0)]],
      customerPositionY: ['', [Validators.required, Validators.min(0)]],
      monexWidth: ['', [Validators.min(0), Validators.required]],
      monexHeight: ['', [Validators.min(0), Validators.required]],
      monexPositionX: ['', [Validators.required, Validators.min(0)]],
      monexPositionY: ['', [Validators.required, Validators.min(0)]],
    });
  }

  initDialogData(data) {
    this.title = data?.title;
    this.contractTemplate = data?.element;
    this.action = data?.action || TABLE_ACTION_TYPE.CREATE;
    if (this.action === TABLE_ACTION_TYPE.VIEW) {
      this.ckeditorConfig.readOnly = true;
      this.contractTemplateForm.disable();
    }
    this.contractTemplateForm.patchValue({
      name: this.contractTemplate?.name,
      content: this.contractTemplate?.content || '',
      statusFlowId: this.contractTemplate?.statusFlow?.id,
      productId: this.contractTemplate?.product?.id,
      isActive: this.contractTemplate?.isActive,
      customerPositionPage: this.contractTemplate?.customerPageIndex
        ? this.contractTemplate?.customerPageIndex + 1
        : 1,
      monexPositionPage: this.contractTemplate?.monexPageIndex
        ? this.contractTemplate?.monexPageIndex + 1
        : 1,
      customerWidth: this.contractTemplate?.customerWidth || 200,
      customerHeight: this.contractTemplate?.customerHeight || 60,
      customerPositionX: this.contractTemplate?.customerPositionX || 0,
      customerPositionY: this.contractTemplate?.customerPositionY || 0,
      monexWidth: this.contractTemplate?.monexWidth || 200,
      monexHeight: this.contractTemplate?.monexHeight || 60,
      monexPositionX: this.contractTemplate?.monexPositionX || 0,
      monexPositionY: this.contractTemplate?.monexPositionY || 0,
    });

    // this.convertHtmlToPdf(this.contractTemplate?.content || '');
    this.previewContract();
  }

  submitForm() {
    this.contractTemplateForm.markAllAsTouched();

    if (this.contractTemplateForm.invalid) {
      return;
    }
    let selectedProduct = this.loanProducts.find((value) => {
      return value.id === this.contractTemplateForm.controls.productId.value;
    });
    if (selectedProduct.contractTemplates) {
      const valueForm = this.contractTemplateForm.value;
      if (valueForm.isActive) {
        const { statusFlowId, productId, isActive } = valueForm;
        this.getContractTemplateList({
          statusFlowId,
          productId,
          isActive,
        }).subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
          let objectResponse;
          objectResponse = response.result;
          if (this.action === TABLE_ACTION_TYPE.CREATE) {
            this.checkWarningWhenCreate(objectResponse);
          } else if (this.action === TABLE_ACTION_TYPE.EDIT) {
            this.checkWarningWhenEdit(objectResponse);
          }
        });
      } else {
        this.closeDialogAndEmitValueForm();
      }
    }
  }

  private checkWarningWhenEdit(objectContractTemplate) {
    if (objectContractTemplate?.items.length > 0) {
      if (objectContractTemplate?.items[0].id != this.contractTemplate.id) {
        this._confirmChangeContract();
      } else {
        this.closeDialogAndEmitValueForm();
      }
    } else {
      this.closeDialogAndEmitValueForm();
    }
  }

  private checkWarningWhenCreate(objectContractTemplate) {
    if (objectContractTemplate?.items.length > 0) {
      this._confirmChangeContract();
    } else {
      this.closeDialogAndEmitValueForm();
    }
  }

  private closeDialogAndEmitValueForm() {
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.contractTemplateForm.getRawValue(),
    });
  }

  private _confirmChangeContract() {
    const confirmChangeContractForProductRef =
      this.notificationService.openPrompt({
        imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
        title: this.multiLanguageService.instant(
          'system.system_config.contract_template.prompt_update_contract_title'
        ),
        content: this.multiLanguageService.instant(
          'system.system_config.contract_template.prompt_update_contract_content'
        ),
        primaryBtnText: this.multiLanguageService.instant('common.confirm'),
        primaryBtnClass: 'btn-error',
        secondaryBtnText: this.multiLanguageService.instant('common.skip'),
      });
    confirmChangeContractForProductRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.dialogRef.close({
          type: BUTTON_TYPE.PRIMARY,
          data: this.contractTemplateForm.getRawValue(),
        });
      }
    });
  }

  private getContractTemplateList(params) {
    const queryMap = {};
    queryMap['isActive'] = true;
    queryMap['product.id'] = params.productId;
    queryMap['statusFlow.id'] = params.statusFlowId;
    return this.monexCoreContractTemplateControllerService.contractTemplateControllerSearchPagination(
      true,
      1,
      1,
      'createdAt',
      JSON.stringify(queryMap)
    );
  }

  public onReadyCkEditor(editor) {
    // editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    //   return new CkEditorAdapters(loader, editor.config);
    // };
    // editor.ui
    //   .getEditableElement()
    //   .parentElement.insertBefore(
    //     editor.ui.view.toolbar.element,
    //     editor.ui.getEditableElement()
    //   );
  }

  public fileUploadRequest($event) {
    console.log('$event', $event);
    const xhr = $event.data.fileLoader.xhr;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
  }

  public fileUploadResponse(e) {
    e.stop();
    const genericErrorText = `Couldn't upload file`;
    let response = JSON.parse(e.data.fileLoader.xhr.responseText);
    console.log('response', response);

    if (!response || response.error) {
      e.data.message =
        response && response.error ? response.error.message : genericErrorText;
      e.cancel();
      return;
    }

    e.data.url = response.url;
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  private _getPropertiesContract() {
    this.subManager.add(
      this.configContractListService
        .getDataPropertiesContract(
          true,
          this.pageIndex + 1,
          this.pageSize,
          'createdAt'
        )
        .subscribe((response: any) => {
          if (
            !response ||
            !response.result ||
            response.responseCode !== RESPONSE_CODE.SUCCESS
          ) {
            return;
          }
          this.dataSource.data = response.result.items.map((element, index) => {
            return { ...element, orderNumber: index + 1 };
          });
          response.result.items;
          this.pageLength = response.result?.meta?.totalPages || 0;
          this.totalItems = response.result?.meta?.totalItems || 0;
        })
    );
  }

  private _getListLoanProducts() {
    this.subManager.add(
      this.configContractListService.getLoanProducts().subscribe((response) => {
        if (
          !response ||
          !response.result ||
          response.responseCode !== RESPONSE_CODE.SUCCESS
        ) {
          return;
        }
        this.loanProducts = response.result;
        this.filteredProducts = this.loanProducts;
        this._getWorkflowStatusesFromProductId(
          this.contractTemplate?.product?.id
        );
        this.filteredWorkflowStatuses = this.workflowStatuses || [];
      })
    );
  }

  // convertHtmlToPdf(data) {
  //   let doc = new jsPDF('p', 'pt', 'a4');
  //   const specialElementHandlers = {
  //     '#editor': function (element, renderer) {
  //       return true;
  //     },
  //   };
  //
  //   doc.fromHTML('<p>đạt</p>', 15, 15, {
  //     width: 190,
  //     elementHandlers: specialElementHandlers,
  //   });
  //
  //   this.docPdf = this.pdfMakeHtmlToPdf(data);
  //   setTimeout(() => {
  //     if (typeof this.docPdf !== 'undefined')
  //       try {
  //         if (
  //           navigator.appVersion.indexOf('MSIE') !== -1 ||
  //           navigator.appVersion.indexOf('Edge') !== -1 ||
  //           navigator.appVersion.indexOf('Trident') !== -1
  //         ) {
  //           let options = {
  //             pdfOpenParams: {
  //               navpanes: 0,
  //               toolbar: 0,
  //               statusbar: 0,
  //               view: 'FitV',
  //             },
  //             forcePDFJS: true,
  //             PDFJS_URL: 'examples/PDF.js/web/viewer.html',
  //           };
  //
  //           this.docPdf.getBlob(function (dataURL) {
  //             PDFObject.embed(dataURL, '#preview-pane', options);
  //           });
  //           // PDFObject.embed(doc.output("bloburl"), "#preview-pane", options);
  //         } else {
  //           this.docPdf.getDataUrl(function (dataURL) {
  //             PDFObject.embed(dataURL, '#preview-pane');
  //           });
  //
  //           // PDFObject.embed(doc.output("datauristring"), "#preview-pane");
  //         }
  //       } catch (e) {
  //         alert('Error ' + e);
  //       }
  //   }, 0);
  // }

  /**
   * Sync preview after 3s ckeditor changed
   * @param data
   */
  onCkeditorChange(data) {
    // if (this.timeout) clearTimeout(this.timeout);
    // this.timeout = setTimeout(() => {
    //   this.convertHtmlToPdf(data);
    // }, 3000);
  }

  onChangeProduct(productId) {
    this.contractTemplateForm.controls.statusFlowId.setValue(null);
    this.filteredProducts = [];
    this._getWorkflowStatusesFromProductId(productId);
    this.filteredWorkflowStatuses = this.workflowStatuses;
  }

  private _getWorkflowStatusesFromProductId(productId) {
    this.workflowStatuses = [];
    if (!this.loanProducts || !productId) return;
    let selectedProduct = this.loanProducts.find((value) => {
      return value.id === productId;
    });
    if (!selectedProduct) return;
    this.workflowStatuses = selectedProduct.statusGroup?.statusFlows || [];
  }

  // pdfMakeHtmlToPdf(data) {
  //   let val = htmlToPdfmake(data);
  //   let pdfData = { content: val };
  //   return pdfmake.createPdf(pdfData);
  // }

  openPdfPreviewNewTab() {
    // this.docPdf.open();
    this.previewContract();
  }

  previewContract() {
    if (!this.contractTemplateForm.controls.content.value) {
      return;
    }
    this.subManager.add(
      this.configContractListService
        .previewContract({
          content: this.contractTemplateForm.controls.content.value,
          customerSigningPosition: {
            pageIndex:
              this.contractTemplateForm.controls.customerPositionPage.value > 0
                ? this.contractTemplateForm.controls.customerPositionPage
                    .value - 1
                : 0,
            positionX:
              this.contractTemplateForm.controls.customerPositionX.value || 0,
            positionY:
              this.contractTemplateForm.controls.customerPositionY.value || 0,
            width:
              this.contractTemplateForm.controls.customerWidth.value || 200,
            height:
              this.contractTemplateForm.controls.customerHeight.value || 60,
          },
          monexSigningPosition: {
            pageIndex:
              this.contractTemplateForm.controls.monexPositionPage.value > 0
                ? this.contractTemplateForm.controls.monexPositionPage.value - 1
                : 0,
            positionX:
              this.contractTemplateForm.controls.monexPositionX.value || 0,
            positionY:
              this.contractTemplateForm.controls.monexPositionY.value || 0,
            width: this.contractTemplateForm.controls.monexWidth.value || 200,
            height: this.contractTemplateForm.controls.monexHeight.value || 60,
          },
        })
        .subscribe((data) => {
          this.pdfView(data);
        })
    );
  }

  pdfView(pdfurl: string) {
    pdfurl += '#toolbar=1&navpanes=0&scrollbar=0&zoom=90';
    this.loanContractView = this.domSanitizer.bypassSecurityTrustHtml(
      "<iframe  src='" +
        pdfurl +
        "' type='application/pdf' style='width:100%; height: 70vh; background-color:white;'>" +
        'Object ' +
        pdfurl +
        ' failed' +
        '</iframe>'
    );
  }
}
