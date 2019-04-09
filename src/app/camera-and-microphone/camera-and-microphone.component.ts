import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-camera-and-microphone',
  templateUrl: './camera-and-microphone.component.html',
  styleUrls: ['./camera-and-microphone.component.scss']
})

// 1. カメラ、マイクの入力を受け付ける
// 2. カメラ、マイクの入力をそれぞれ中断する
// 1. カメラ、マイクの入力を終了する
//   1. UI（meetsみたいなicon）をキャンバス要素に重ねる
// 1. 録音して、ファイルをダウンロードする
// 1. 写真をとり、ファイルをダウンロードする
// 1. 録画し、ファイルをダウンロードする
export class CameraAndMicrophoneComponent implements OnInit {
  mediaDevicesSupport: boolean;
  webkitGetUserMediaSupport: boolean;
  enumerateDevicesSupport: boolean;

  @ViewChild('video') videoElm: ElementRef;
  @ViewChild('canvas') canvasElm: ElementRef;
  // Default video & audio are OFF
  videoStart = false;
  audioStart = false;
  videoDevices: MediaDeviceInfo[] = [];
  audioDevices: MediaDeviceInfo[] = [];

  medias: MediaStreamConstraints = {
    audio: false,
    video: false,
  };

  mediaDeviceFormGroup = this.formBuilder.group({
    videoDevice: ['', Validators.required],
    audioDevice: ['', Validators.required],
  });
  get videoDevice() { return this.mediaDeviceFormGroup.get('videoDevice'); }
  get audioDevice() { return this.mediaDeviceFormGroup.get('audioDevice'); }


  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.checkSupportAPI();
    // this.getMediaDevicesInfo();
    // this.subscribeMediaDevice();
  }

  checkSupportAPI() {
    this.mediaDevicesSupport = 'mediaDevices' in navigator ? true : false;
    this.webkitGetUserMediaSupport = 'webkitGetUserMedia' in navigator ? true : false;
    if (this.mediaDevicesSupport) {
      this.enumerateDevicesSupport = 'enumerateDevices' in navigator.mediaDevices ? true : false;
    } else {
      this.enumerateDevicesSupport = false;
    }

    console.log('this.mediaDevicesSupport: ', this.mediaDevicesSupport);
    console.log('this.webkitGetUserMediaSupport: ', this.webkitGetUserMediaSupport);
    console.log('this.enumerateDevicesSupport: ', this.enumerateDevicesSupport);
  }

  getMediaDevicesInfo() {
    navigator.mediaDevices.enumerateDevices().then(
      devices => {
        devices.forEach(device => {
          if (device['kind'] === 'videoinput') {
            this.videoDevices.push(device);
          } else if (device['kind'] === 'audioinput') {
            this.audioDevices.push(device);
          }
          // console.log(device);
        });
      }
    ).catch(
      err => {
        console.error('enumerateDevide ERROR:', err);
      }
    );
  }

  subscribeMediaDevice() {
    this.mediaDeviceFormGroup.valueChanges.subscribe(
      (value) => {
        if (value.videoDevice && value.audioDevice) {
          this.medias = {
            video: {deviceId: { exact: value.videoDevice.deviceId }},
            audio: {deviceId: { exact: value.audioDevice.deviceId }}
          };
        } else if (value.videoDevice && !value.audioDevice) {
          this.medias = {
            video: {deviceId: { exact: value.videoDevice.deviceId }},
            audio: false
          };
        } else if (!value.videoDevice && value.audioDevice) {
          this.medias = {
            video: false,
            audio: {deviceId: { exact: value.audioDevice.deviceId }}
          };
        } else if (!value.videoDevice && !value.audioDevice) {
          this.medias = {
            video: false,
            audio: false
          };
        }
        // console.log('subscribeMediaDevice: ', this.medias);
      }
    );
  }

  toggleVideoMedia() {
    if (this.videoStart) {
      this.stopVideo();
    } else {
      this.startVideo();
    }
  }

  toggleAudioMedia() {
    if (this.audioStart) {
      this.stopAudio();
    } else {
      this.startAudio();
    }
  }

  startVideo() {
    this.medias.video = true;
    navigator.mediaDevices.getUserMedia(this.medias).then(
      (localStream: MediaStream) => {
        this.videoElm.nativeElement.srcObject = localStream;
        this.videoStart = true;
        // console.log('this.videoElm.nativeElement.srcObject:', this.videoElm.nativeElement.srcObject);
        // console.log('localStream: ', localStream);
        // if (!this.videoElm.nativeElement.srcObject) {
        //   this.videoElm.nativeElement.srcObject = localStream;
        // } else {
        //   console.log('.getVideoTracks()[0]:', this.videoElm.nativeElement.srcObject.getVideoTracks()[0]);
        //   console.log('localStream.getVideoTracks()[0]: ', localStream.getVideoTracks()[0]);
        //   this.videoElm.nativeElement.srcObject.getVideoTracks()[0] = localStream.getVideoTracks()[0];
        // }
        // this.videoStart = true;
      }
    ).catch(
      error => {
        console.error(error);
        this.videoStart = false;
      }
    );
  }

  startAudio() {
    this.medias.audio = true;
    navigator.mediaDevices.getUserMedia(this.medias).then(
      (localStream: MediaStream) => {
        // this.videoElm.nativeElement.srcObject.getAudioTracks()[0] = localStream.getAudioTracks()[0];
        this.videoElm.nativeElement.srcObject = localStream;
        this.audioStart = true;
      }
    ).catch(
      error => {
        console.error(error);
        this.audioStart = false;
      }
    );
  }

  stopVideo() {
    this.medias.video = false;
    // console.log('v0:', this.videoElm.nativeElement.srcObject);
    // console.log('v1:', this.videoElm.nativeElement.srcObject.getVideoTracks()[0]);
    // console.log('v2:', this.videoElm.nativeElement.srcObject.getVideoTracks().length);
    // console.log('v3:', this.videoElm.nativeElement.srcObject.getAudioTracks().length);
    // this.videoElm.nativeElement.srcObject.getVideoTracks()[0].enabled = false;
    // this.videoElm.nativeElement.srcObject.getVideoTracks()[0].stop();
    // console.log('vv0:', this.videoElm.nativeElement.srcObject);
    // console.log('vv1:', this.videoElm.nativeElement.srcObject.getVideoTracks()[0]);
    // console.log('vv2:', this.videoElm.nativeElement.srcObject.getVideoTracks().length);
    // console.log('vv3:', this.videoElm.nativeElement.srcObject.getAudioTracks().length);
    this.videoElm.nativeElement.pause();
    const track = this.videoElm.nativeElement.srcObject.getTracks()[0] as MediaStreamTrack;
    track.stop();
    this.videoStart = false;
  }

  stopAudio() {
    this.medias.audio = false;
    console.log('a0:', this.videoElm.nativeElement.srcObject);
    console.log('a1:', this.videoElm.nativeElement.srcObject.getAudioTracks()[0]);
    console.log('a2:', this.videoElm.nativeElement.srcObject.getAudioTracks().length);
    console.log('a3:', this.videoElm.nativeElement.srcObject.getVideoTracks().length);
    this.videoElm.nativeElement.srcObject.getAudioTracks()[0].enabled = false;
    this.videoElm.nativeElement.srcObject.getAudioTracks()[0].stop();
    console.log('aa0:', this.videoElm.nativeElement.srcObject);
    console.log('aa1:', this.videoElm.nativeElement.srcObject.getAudioTracks()[0]);
    console.log('aa2:', this.videoElm.nativeElement.srcObject.getAudioTracks().length);
    console.log('aa3:', this.videoElm.nativeElement.srcObject.getVideoTracks().length);
    this.audioStart = false;
  }






  savePicture() {
    // 写真のサイズを決める
    // const WIDTH = this.videoElm.nativeElement.clientWidth;
    // const HEIGHT = this.videoElm.nativeElement.clientHeight;

    // canvasを用意する
    // const ctx = this.canvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    // this.canvasElm.nativeElement.width  = WIDTH;
    // this.canvasElm.nativeElement.height = HEIGHT;

    // const a = this.renderer.createElement('a') as HTMLAnchorElement;

    // canvasの描画をしつつBase64データを取る
    // a.href = this.canvasElm.nativeElement.toDataURL(ctx.drawImage(this.videoElm.nativeElement, 0, 0, WIDTH, HEIGHT));
    // a.setAttribute('download', 'image.png');
    // a.click();


    // Open Dialog
    const dialogRef = this.dialog.open(SavePictureDialogComponent, {
      // width: '250px',
      data: this.videoElm.nativeElement
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}


@Component({
  selector: 'app-dialog',
  templateUrl: 'save-picture-dialog.html',
})
export class SavePictureDialogComponent implements OnInit {
  @ViewChild('savePictureCanvas') savePictureCanvasElm: ElementRef;


  constructor(
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<SavePictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    const ctx = this.savePictureCanvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.savePictureCanvasElm.nativeElement.width  = 512;
    this.savePictureCanvasElm.nativeElement.height = 512;

    ctx.drawImage(this.data, 0, 0, 512, 512);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  savePicture() {
    const a = this.renderer.createElement('a') as HTMLAnchorElement;
    a.href = this.savePictureCanvasElm.nativeElement.toDataURL(this.data);
    a.setAttribute('download', 'image.png');
    a.click();
  }

}
