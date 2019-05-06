import { Component, OnInit, ElementRef } from '@angular/core';
import { GoogleLoginService } from '../services/google-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-photo',
  templateUrl: './google-photo.component.html',
  styleUrls: ['./google-photo.component.scss']
})
export class GooglePhotoComponent implements OnInit {
  sourceTitle: string;
  destinationTitle: string;
  srcImage = '';
  destImage = '';
  srcExpiresIn = 0;
  destExpiresIn = 0;

  constructor(
    private googleLoginService: GoogleLoginService,
    private element: ElementRef,
    private router: Router
  ) { }

  ngOnInit() {
    const now: Date = new Date();

    this.sourceTitle = localStorage.getItem('loggedInEmailSrc') ? localStorage.getItem('loggedInEmailSrc') : 'Login with Google';
    this.srcImage = localStorage.getItem('loggedInImageSrc') ? localStorage.getItem('loggedInImageSrc') : '';
    this.destinationTitle = localStorage.getItem('loggedInEmailDest') ? localStorage.getItem('loggedInEmailDest') : 'Login with Google';
    this.destImage = localStorage.getItem('loggedInImageDest') ? localStorage.getItem('loggedInImageDest') : '';
    this.srcExpiresIn = Math.floor((Number.parseInt(((new Date(localStorage.getItem('GoogleToeknExpiresSrc'))).getTime() - now.getTime()).toString()))/(1000*60));
    this.destExpiresIn = Math.floor((Number.parseInt(((new Date(localStorage.getItem('GoogleToeknExpiresDest'))).getTime() - now.getTime()).toString()))/(1000*60));
  }

  public loginToGoogle(type: string) {
    this.googleLoginService.googleInit(this.element, type).then(
      (val) => {
        if (type === 'src') {
          this.sourceTitle = localStorage.getItem('loggedInEmailSrc');
          this.srcImage = localStorage.getItem('loggedInImageSrc');
        } else if (type === 'dest') {
          this.destinationTitle = localStorage.getItem('loggedInEmailDest');
          this.destImage = localStorage.getItem('loggedInImageDest');
        }
        if (this.googleLoginService.checkLogIn()) {
          setTimeout(() => {
            this.router.navigateByUrl('/Migrate');
          }, 500);
        }
      },
      (err) => { console.log(err); }
    );
  }

}
