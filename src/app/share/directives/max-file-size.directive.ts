import { Directive, ElementRef, Input } from '@angular/core';
import filesToFileListItem from '../../core/utils/files-to-file-list-item';

@Directive({
  selector: '[appMaxFileSize]',
})
export class MaxFileSizeDirective {
  @Input() maxSizeOfFile: number;

  constructor(private el: ElementRef) {
    el.nativeElement.addEventListener('change', () => {
      let files = el.nativeElement.files; // puts all files into an array
      let validFiles: File[] = [];

      // call them as such; files[0].size will get you the file size of the 0th file
      Array.from(files).filter((file: any) => {
        let filesize = file.size / 1024 / 1024; // MB
        if (filesize < this.maxSizeOfFile) {
          return validFiles.push(file);
        }
      });
      el.nativeElement.files = filesToFileListItem(validFiles);
    });
  }
}
