import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-audio-visualization',
  templateUrl: './audio-visualization.component.html',
  styleUrls: ['./audio-visualization.component.scss']
})
export class AudioVisualizationComponent implements OnInit {
  @ViewChild('video') videoElm: ElementRef;
  @ViewChild('canvas') canvasElm: ElementRef;
  startRec = false;
  audioContext = new AudioContext();
  sourceNode: MediaStreamAudioSourceNode;
  analyserNode: AnalyserNode;

  // bufferSize = 1024;

  medias: MediaStreamConstraints = {
    audio: true,
    video: false,
  };

  constructor() { }

  ngOnInit() {
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia(this.medias).then(
      (localStream: MediaStream) => {
        this.videoElm.nativeElement.srcObject = localStream;
        // this.canvasElm.nativeElement.srcObject = localStream;
        this.sourceNode = this.audioContext.createMediaStreamSource(localStream);
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 2048;
        this.sourceNode.connect(this.analyserNode);

        this.visualize();

        this.startRec = true;
      }
    ).catch(
      error => {
        console.error(error);
        this.startRec = false;
      }
    );
    // this.startRec = true;
  }

  stopRecording() {
    this.canvasElm.nativeElement.srcObject.getAudioTracks()[0].enabled = false;
    this.canvasElm.nativeElement.srcObject.getAudioTracks()[0].stop();
    this.startRec = false;
  }

  visualize() {
    const ctx = this.canvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    const WIDTH = this.canvasElm.nativeElement.clientWidth;
    const HEIGHT = this.canvasElm.nativeElement.clientHeight;

    const array = new Uint8Array(this.analyserNode.fftSize);
    this.analyserNode.getByteTimeDomainData(array);
    const barWidth = WIDTH / this.analyserNode.fftSize;
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < this.analyserNode.fftSize; ++i) {
      // console.log('this.analyserNode: ', this.analyserNode);
      const value = array[i];
      const percent = value / 255;
      const height = HEIGHT * percent;
      const offset = HEIGHT - height;

      ctx.fillStyle = 'lime';
      ctx.fillRect(i * barWidth, offset, barWidth, 2);
    }

    requestAnimationFrame(this.visualize);
  }

}
