import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef, AfterViewInit
} from '@angular/core';

import videojs from 'video.js';

import * as Record from 'videojs-record/dist/videojs.record.js';
import * as moment from 'moment';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {


  // reference to the element itself: used to access events and methods
  private _elementRef: ElementRef;

  // index to create unique ID for component
  idx = 'zan1';

  private config: any;
  private player: any;
  private plugin: any;

  // constructor initializes our declared vars
  constructor(elementRef: ElementRef) {
    this.player = false;

    // save reference to plugin (so it initializes)
    this.plugin = Record;

    // video.js configuration
    this.config = {
      controls: true,
      autoplay: true,
      aspectRatio: '16:9',
      // fluid: true,
      loop: false,
      controlBar: {
        volumePanel: false,
        fullscreenToggle: false
      },
      fullscreen: {options: {navigationUI: 'hide'}},
      plugins: {
        // configure videojs-record plugin
        record: {
          audio: false,
          // video: true,
          debug: false,
          maxLength: 30,
          // screen: true,
          // video: {
          //   // video constraints: set resolution of camera
          //   mandatory: {
          //     minWidth: 1280,
          //     minHeight: 800,
          //   },
          // },
          video: {
            width: {ideal: 640 },
            height: {ideal: 360 }
          },
          frameWidth: 640,
          frameHeight: 360
        }
      }
    };
  }

  ngOnInit() {}

  // use ngAfterViewInit to make sure we initialize the videojs element
  // after the component template itself has been rendered
  ngAfterViewInit() {
    // ID with which to access the template's video element
    let el = 'video_' + this.idx;

    // setup the player via the unique element ID
    this.player = videojs(document.getElementById(el), this.config, () => {
      console.log('player ready! id:', el);

      // print version information at startup
      // var msg = 'Using video.js ' + videojs.VERSION +
      //     ' with videojs-record ' + videojs.getPluginVersion('record') +
      //     ' and recordrtc ' + RecordRTC.version;
      // videojs.log(msg);
    });

    // device is ready
    this.player.on('deviceReady', () => {
      console.log('device is ready!');

      setTimeout(() => { this.player.record().start()}, 400);
    });

    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', this.player.recordedData);
      const fileName = moment().format('YYYY-MM-DD-HH:mm:s');

      this.player.record().saveAs({video: `video-${fileName}.mp4` });
      this.player.record().reset();
    });

    // error handling
    this.player.on('error', (element, error) => {
      console.warn(error);
    });

    this.player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });

    this.player.on('ready', () =>
    {
      // console.log('dipanggilkan **************');

      // this.player.record().getDevice()
      // var device = document.getElementsByClassName('vjs-device-button')[0] as HTMLElement;
      //
      // device.click();
      // console.log(document.getElementsByClassName('vjs-device-button'));
    });

  }


  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = false;
    }
  }

}
