import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

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
export class CameraAndMicrophoneComponent implements OnInit, AfterViewInit {
  @ViewChild('video') videoElm: ElementRef;
  @ViewChild('canvas') canvasElm: ElementRef;

  private captureData: string;
  private medias: MediaStreamConstraints = {
    audio: true,
    video: {
      facingMode: 'user',
    }
  };

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.startCamera();
  }

  click() {
    if (this.videoElm.nativeElement.srcObject) {
      if (this.videoElm.nativeElement.srcObject.getVideoTracks()[0].enabled === true) {
        // this.videoElm.nativeElement.srcObject.getVideoTracks()[0].enabled = false;
        // this.videoElm.nativeElement.srcObject.getAudioTracks()[0].enabled = false;
        this.videoElm.nativeElement.srcObject.getVideoTracks()[0].stop();
        this.videoElm.nativeElement.srcObject.getAudioTracks()[0].stop();
      } else {
        this.videoElm.nativeElement.srcObject.getVideoTracks()[0].enabled = true;
        this.videoElm.nativeElement.srcObject.getAudioTracks()[0].enabled = true;
      }
    }
    console.log('click this.medias: ', this.medias);
  }

  startCamera() {
    // this.medias = {
    //   audio: true,
    //   video: {
    //     facingMode: 'user',
    //   }
    // };

    window.navigator.mediaDevices.getUserMedia(this.medias)
      .then(stream => this.videoElm.nativeElement.srcObject = stream)
      .catch(error => {
        console.error(error);
      });

    console.log('startCamera this.medias: ', this.medias);
    // console.log('this.videoElm.nativeElement.srcObject.getTracks()', this.videoElm.nativeElement.srcObject.getTracks().length);
  }

  stopCamera() {
    // this.videoElm.nativeElement.pause();
    const track = this.videoElm.nativeElement.srcObject.getTracks()[0] as MediaStreamTrack;
    track.stop();
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
