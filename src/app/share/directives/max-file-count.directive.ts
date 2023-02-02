import { Directive, ElementRef, Input } from '@angular/core';
import filesToFileListItem from '../../core/utils/files-to-file-list-item';

@Directive({
  selector: '[appMaxFileCount]',
})
export class MaxFileCountDirective {
  @Input() maxNumberOfFile: number;

  constructor(private el: ElementRef) {
    el.nativeElement.addEventListener('change', () => {
      let files = el.nativeElement.files; // puts all files into an array
      let validFiles: any[] = [];

      if (files.length > this.maxNumberOfFile) {
        validFiles = Array.from(files).slice(0, this.maxNumberOfFile);
        el.nativeElement.files = filesToFileListItem(validFiles);
      }
    });
  }
}
