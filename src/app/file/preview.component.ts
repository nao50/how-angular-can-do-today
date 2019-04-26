import { Component, OnInit, OnDestroy, EventEmitter, Renderer2, SecurityContext } from '@angular/core';
import { Observable } from 'rxjs';
import { SafeUrl, ɵDomSanitizerImpl, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { UploadFileDialogComponent } from './upload-file-dialog';
import { filter } from 'rxjs/operators';
import { FileHandle } from '../directives/file-drop.directive';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  private _closing = new EventEmitter<{}>();

  // private _filehandle: FileHandle = '';
  private _discription = '';
  private _url: SafeUrl = '';
  private _size = 0;
  private _sizeUnit = '';
  private _filename = '';
  private _file: File;

  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    protected _sanitizer: DomSanitizer,
    protected _sanitizerImpl: ɵDomSanitizerImpl
  ) { }

  ngOnInit() {
    // console.log(`SampleComponent.ngOnInit >> no="${this._no}"`);
  }

  ngOnDestroy() {
    // console.log(`SampleComponent.ngOnDestroy >> no="${this._no}"`);
  }

  public get closing(): Observable<{}> {
    return this._closing;
  }

  public set filehandle(value: FileHandle) {
    if (value.file) {
      this.file = value.file;
      this.size = value.file.size;
      this.url = value.url;
    }
  }

  // public get file(): File {
  //   return this.file;
  // }
  public set file(value: File) {
    this._file = value;
  }
  public set discription(value: string) {
    this._discription = value;
  }
  public set url(value: SafeResourceUrl) {
    this._url = value;
  }
  public set size(value: number) {
    this._size = value;
    if ((this._size / 1000) < 1) {
        this._sizeUnit = this._size + ' B';
    } else if ((this._size / 1000000) < 1) {
        this._sizeUnit = Math.round(this._size / 1000) + ' KB';
    } else if ((this._size / 1000000) < 1) {
        this._sizeUnit = Math.round(this._size / 1000000) + ' MB';
    }
  }
  public set filename(value: string) {
    this._filename = value;
  }

  del(): void {
    this._closing.emit({});
  }

  download(): void {
    const sanitizedUrl = this._sanitizerImpl.sanitize(SecurityContext.RESOURCE_URL,  this._url);
    const a = this.renderer.createElement('a') as HTMLAnchorElement;
    a.href = sanitizedUrl;
    a.setAttribute('download', this._filename);
    a.click();
  }
}
