import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pd-group-element',
  templateUrl: './pd-group-element.component.html',
  styleUrls: ['./pd-group-element.component.scss']
})
export class PdGroupElementComponent implements OnInit {
  @Input() merchantInfo;

  constructor() {
  }

  ngOnInit(): void {
  }

}
