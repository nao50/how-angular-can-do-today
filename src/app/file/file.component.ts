import { Component, OnInit, ViewChild, EventEmitter, HostBinding } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  public onFileDrop: EventEmitter<File[]> = new EventEmitter<File[]>();
  @HostBinding('style.isActive') isActive = true;

  @ViewChild('fileInput')
  fileInput;

  file: File | null = null;

  fileFormGroup = this.formBuilder.group({
    file: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.setHostClassByInterval();
  }

  ngOnInit() {
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }

  onDragOver(event: any): void {
    console.log('onDragOver: ');
    event.preventDefault();
  }


  onDrop(event: any): void {
    console.log('onDrop: ');
    event.preventDefault();
    this.onFileDrop.emit(event.dataTransfer.files);
  }

  setHostClassByInterval() {
    setInterval(() => {
        this.isActive = !this.isActive;
        }, 3000
   );
 }

}
