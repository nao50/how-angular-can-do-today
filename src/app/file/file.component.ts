import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Renderer2, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileHandle } from '../directives/file-drop.directive';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

import { PreviewComponent } from './preview.component';
import { ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  factory: ComponentFactory<PreviewComponent>;
  @ViewChild('preview', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

  // public onFileDrop: EventEmitter<File[]> = new EventEmitter<File[]>();

  @ViewChild('fileInput') fileInput;
  file: File | null = null;

  fileFormGroup = this.formBuilder.group({
    file: ['', []],
  });

  files: FileHandle[] = [];

  constructor(
    private resolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.factory = this.resolver.resolveComponentFactory(PreviewComponent);
  }

  addPreview(discription: string, filehandle: any, filename: string) {
    const componentRef = this.viewContainerRef.createComponent(this.factory);

    if (filehandle.file) {
      componentRef.instance.url = filehandle.url;
      componentRef.instance.size = filehandle.file.size;
    }
    componentRef.instance.discription = discription;
    componentRef.instance.filename = filename;

    componentRef.instance.closing.subscribe(() => {
      componentRef.destroy();
    });
  }

  filesDropped(files: FileHandle[]): void {
    console.log('files: ', files);
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

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: 'upload-file-dialog.html',
  styleUrls: ['./upload-file-dialog.scss']
})
export class UploadFileDialogComponent implements OnInit {
  filename: string;

  fileFormGroup = this.formBuilder.group({
    discription: [''],
    data: [''],
    filename: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    // private renderer: Renderer2,
    public dialogRef: MatDialogRef<UploadFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data.file) {
      this.fileFormGroup.patchValue({discription: '', data: this.data, filename: this.data.file.name});
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadFile() {
    this.dialogRef.close(this.fileFormGroup.value);
    // const a = this.renderer.createElement('a') as HTMLAnchorElement;
    // a.href = this.savePictureCanvasElm.nativeElement.toDataURL(this.data);
    // a.setAttribute('download', 'image.png');
    // a.click();
  }

}
