import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { ChartDataSets, ChartType } from 'chart.js';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromStore from '../../core/store';
import * as fromActions from '../../core/store';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';
import { NAV_ITEM } from '../../core/common/enum/operator';
import { DisplayedFieldsModel } from '../../public/models/filter/displayed-fields.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  doughnutChartLabels: Label[] = ['Ứng lương', 'Đầu tư', 'Bảo hiểm'];
  doughnutChartData: MultiDataSet = [[55, 25, 20]];
  doughnutChartType: ChartType = 'doughnut';

  lineChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Khách hàng mới' },
  ];

  lineChartLabels: Label[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(201,253,219,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  allColumns: DisplayedFieldsModel[] = [];
  dataSource = new MatTableDataSource([]);

  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public matDialog: MatDialog,
    public formBuilder: FormBuilder,
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService
  ) {}
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   this.multiLanguageService.instant('page_title.dashboard') +
    //     ' - ' +
    //     environment.PROJECT_NAME
    // );
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.DASHBOARD));
    this.totalItems = ELEMENT_DATA.length;
  }
}
