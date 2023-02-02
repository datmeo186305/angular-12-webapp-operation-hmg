import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pd-answers-element',
  templateUrl: './pd-answers-element.component.html',
  styleUrls: ['./pd-answers-element.component.scss']
})
export class PdAnswersElementComponent implements OnInit {
  @Input() merchantInfo;


  constructor() {
  }

  ngOnInit(): void {
  }

}
