import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pd-question-element',
  templateUrl: './pd-question-element.component.html',
  styleUrls: ['./pd-question-element.component.scss'],
})
export class PdQuestionElementComponent implements OnInit {
  @Input() merchantInfo;

  constructor() {}

  ngOnInit(): void {}
}
