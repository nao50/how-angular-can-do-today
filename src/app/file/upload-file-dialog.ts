import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Renderer2, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
        this.fileFormGroup.patchValue({
          discription: '',
          data: this.data,
          filename: this.data.file.name
        });
      }
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    uploadFile() {
      this.dialogRef.close(this.fileFormGroup.value);
    }

}
