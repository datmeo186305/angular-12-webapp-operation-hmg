import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fullsize-image-dialog',
  templateUrl: './fullsize-image-dialog.component.html',
  styleUrls: ['./fullsize-image-dialog.component.scss'],
})
export class FullsizeImageDialogComponent implements OnInit {
  imageSrc: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<FullsizeImageDialogComponent>
  ) {
    if (data) {
      this.imageSrc = data.imageSrc;
    }
  }

  ngOnInit(): void {}

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
