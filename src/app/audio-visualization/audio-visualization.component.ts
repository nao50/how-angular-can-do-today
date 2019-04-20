import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export interface GainForm {
  gain: number;
}
export interface OscillatorForm {
  type: string;
  frequency: number;
  detune: number;
}

@Component({
  selector: 'app-audio-visualization',
  templateUrl: './audio-visualization.component.html',
  styleUrls: ['./audio-visualization.component.scss']
})
export class AudioVisualizationComponent implements OnInit {
  playing = false;
  types: string[] = ['sine', 'square', 'sawtooth', 'triangle'];

  audioctx = new AudioContext();
  osc = new OscillatorNode(this.audioctx);
  gain = new GainNode(this.audioctx);

  oscillatorFormGroup = this.formBuilder.group({
    type: ['sine', [Validators.required]],
    frequency: [440, [Validators.required]],
    detune: [0, [Validators.required]],
  });

  gainFormGroup = this.formBuilder.group({
    gain: [0.5, [Validators.required]],
  });

  formatFrequency(value: number | null) {
    return value + 'Hz';
  }

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.gainFormGroup.valueChanges.subscribe(
      (value: GainForm) => {
        console.log('value: GainForm: ', value);
      }
    );

    this.oscillatorFormGroup.valueChanges.subscribe(
      (value: OscillatorForm) => {
        console.log('value: GainForm: ', value);
      }
    );
  }

  play() {
    this.playing = true;

    const audioctx = new AudioContext();      // AudioContext を作成
    const osc = new OscillatorNode(audioctx); // オシレータを作成
    const gain = new GainNode(audioctx); // ゲインを作成

    osc.type = this.oscillatorFormGroup.value.type;
    osc.frequency.value = this.oscillatorFormGroup.value.frequency;
    gain.gain.value = this.gainFormGroup.value.gain;

    osc.connect(gain).connect(audioctx.destination);  // オシレータを出力に接続
    osc.start();

    osc.stop( audioctx.currentTime + 1 );
  }

  stop() {
    this.playing = false;
  }
}
