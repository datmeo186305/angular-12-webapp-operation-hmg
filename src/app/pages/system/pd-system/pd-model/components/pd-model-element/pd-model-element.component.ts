import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pd-model-element',
  templateUrl: './pd-model-element.component.html',
  styleUrls: ['./pd-model-element.component.scss'],
})
export class PdModelElementComponent implements OnInit {
  @Input() merchantInfo;

  constructor() {}

  ngOnInit(): void {}
}
