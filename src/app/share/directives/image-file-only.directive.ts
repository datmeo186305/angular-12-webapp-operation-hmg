import { Directive, ElementRef, Input } from '@angular/core';
import filesToFileListItem from '../../core/utils/files-to-file-list-item';

@Directive({
  selector: '[appImageFileOnly]',
})
export class ImageFileOnlyDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.addEventListener('change', () => {
      let files = el.nativeElement.files; // puts all files into an array
      let validFiles: File[] = [];

      Array.from(files).filter((file: any) => {
        if (this.isFileImage(file)) {
          return validFiles.push(file);
        }
      });
      el.nativeElement.files = filesToFileListItem(validFiles);
    });
  }

  isFileImage(file: any) {
    return file && file.type.split('/')[0] === 'image';
  }
}
