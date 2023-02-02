import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pl-check-element',
  templateUrl: './pl-check-element.component.html',
  styleUrls: ['./pl-check-element.component.scss'],
})
export class PlCheckElementComponent implements OnInit {
  @Input() statusValue: boolean;

  constructor() {}

  ngOnInit(): void {}
}
