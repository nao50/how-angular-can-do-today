import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
// 1. （追加）マイクの入力をヒストグラム化する
// 1. 写真をとり、ファイルをダウンロードする
// 1. 録画し、ファイルをダウンロードする
export class CameraAndMicrophoneComponent implements OnInit {
  @ViewChild('video') videoElm: ElementRef;
  @ViewChild('canvas') canvasElm: ElementRef;
  // Default video & audio are OFF
  videoStart = false;
  audioStart = false;
  videoDevices: MediaDeviceInfo[] = [];
  audioDevices: MediaDeviceInfo[] = [];

  medias: MediaStreamConstraints = {};

  mediaDeviceFormGroup = this.formBuilder.group({
    videoDevice: ['', Validators.required],
    audioDevice: ['', Validators.required],
  });
  get videoDevice() { return this.mediaDeviceFormGroup.get('videoDevice'); }
  get audioDevice() { return this.mediaDeviceFormGroup.get('audioDevice'); }


  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.getMediaDevicesInfo();
    this.subscribeMediaDevice();
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
      });
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
    if (!this.videoElm.nativeElement.srcObject) {
      this.startMedia();
    } else {
      if (!this.videoElm.nativeElement.srcObject.active) {
        this.startMedia();
      } else {
        this.stopVideo();
      }
    }
  }

  toggleAudioMedia() {
    if (!this.videoElm.nativeElement.srcObject) {
      this.startMedia();
    } else if (this.videoElm.nativeElement.srcObject) {
      // if (this.videoElm.nativeElement.srcObject.getAudioTracks()[0].enabled === true) {
      if (this.videoElm.nativeElement.srcObject.getAudioTracks()[0]) {
        this.stopAudio();
      } else {
        this.startMedia();
      }
    }
  }


  startMedia() {
    if (this.medias.video) {
      this.videoStart = true;
    } else {
      this.videoStart = false;
    }
    if (this.medias.audio) {
      this.audioStart = true;
    } else {
      this.audioStart = false;
    }

    navigator.mediaDevices.getUserMedia(this.medias).then(
      (localStream: MediaStream) => {
        this.videoElm.nativeElement.srcObject = localStream;
      }
    ).catch(
      error => {
        console.error(error);
      }
    );
  }

  stopVideo() {
    this.videoElm.nativeElement.srcObject.getVideoTracks()[0].enabled = false;
    this.videoElm.nativeElement.srcObject.getVideoTracks()[0].stop();
    this.videoStart = false;
  }

  stopAudio() {
    this.videoElm.nativeElement.srcObject.getAudioTracks()[0].enabled = false;
    this.videoElm.nativeElement.srcObject.getAudioTracks()[0].stop();
    this.audioStart = false;
  }






  savePicture() {
    // 写真のサイズを決める
    const WIDTH = this.videoElm.nativeElement.clientWidth;
    const HEIGHT = this.videoElm.nativeElement.clientHeight;

    // canvasを用意する
    const ctx = this.canvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.canvasElm.nativeElement.width  = WIDTH;
    this.canvasElm.nativeElement.height = HEIGHT;

    // this.apiService.savePicture(this.captureData);
    const a = this.renderer.createElement('a') as HTMLAnchorElement;

    // canvasの描画をしつつBase64データを取る
    a.href = this.canvasElm.nativeElement.toDataURL(ctx.drawImage(this.videoElm.nativeElement, 0, 0, WIDTH, HEIGHT));
    a.setAttribute('download', 'image.png');
    a.click();
  }

}
