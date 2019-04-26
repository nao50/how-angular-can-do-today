import { Component, OnInit, ViewChild } from '@angular/core';
import { FileHandle } from '../directives/file-drop.directive';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

import { PreviewComponent } from './preview.component';
import { ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

import { UploadFileDialogComponent } from './upload-file-dialog';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  factory: ComponentFactory<PreviewComponent>;
  @ViewChild('preview', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

  @ViewChild('fileInput') fileInput;
  file: File | null = null;

  files: FileHandle[] = [];

  constructor(
    private resolver: ComponentFactoryResolver,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.factory = this.resolver.resolveComponentFactory(PreviewComponent);
  }

  addPreview(discription: string, filehandle: any, filename: string) {
    const componentRef = this.viewContainerRef.createComponent(this.factory);

    console.log('filehandle: ', filehandle);

    componentRef.instance.filehandle = filehandle;
    componentRef.instance.discription = discription;
    componentRef.instance.filename = filename;

    componentRef.instance.closing.subscribe(() => {
      componentRef.destroy();
    });
  }

  filesDropped(files: FileHandle[]): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Open Dialog
      const dialogRef = this.dialog.open(UploadFileDialogComponent, {
        width: '32.5rem',
        disableClose: true,
        data: {file: file.file, url: file.url}
      });
      dialogRef.afterClosed().pipe(filter(value => value)).subscribe(
        (value) => {
          this.addPreview(value.discription, value.data, value.filename);
        }
      );
    }
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(files: File[]): void {
    this.files = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      this.files.push({ file, url });

      // Open Dialog
      const dialogRef = this.dialog.open(UploadFileDialogComponent, {
        width: '32.5rem',
        disableClose: true,
        data: {file: file, url: url}
      });
      dialogRef.afterClosed().pipe(filter(value => value)).subscribe(
        (value) => {
          this.addPreview(value.discription, value.data, value.filename);
        }
      );
    }
  }
}
