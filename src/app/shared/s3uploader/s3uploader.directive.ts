import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';

import { S3uploaderService } from './s3uploader.service';

@Directive({ selector: '[s3upload]' })
export class UploadDirective {
  @Input() public s3upload: S3uploaderService;
  @Output() public fileOver: EventEmitter<any> = new EventEmitter();

  private element: ElementRef;
  public constructor(element: ElementRef,private s3uploadservice:S3uploaderService) {
    this.element = element;
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
    let transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    this._preventAndStop(event);
    this.s3uploadservice.add(transfer.files);
    this.fileOver.emit(false);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: any): void {
    let transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }

    transfer.dropEffect = 'copy';
    this._preventAndStop(event);
    this.fileOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any): any {
    if (event.currentTarget === (this as any).element[0]) {
      return;
    }

    this._preventAndStop(event);
    this.fileOver.emit(false);
  }

  private _getTransfer(event: any): any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  }

  private _preventAndStop(event: any): any {
    event.preventDefault();
    event.stopPropagation();
  }

  private _haveFiles(types: any): any {
    if (!types) {
      return false;
    }

    if (types.indexOf) {
      return types.indexOf('Files') !== -1;
    } else if (types.contains) {
      return types.contains('Files');
    } else {
      return false;
    }
  }
}
