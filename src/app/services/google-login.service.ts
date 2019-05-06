declare const gapi: any;
import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleLoginService {
  clientId = '1006301797410-kch7quj0vk9pnuh7v5qabclmpj8k6kcc.apps.googleusercontent.com';
  scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly',
    'https://www.googleapis.com/auth/photoslibrary.readonly',
    'https://www.googleapis.com/auth/photoslibrary.appendonly',
    'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
    'https://www.googleapis.com/auth/photoslibrary',
    'https://www.googleapis.com/auth/photoslibrary.sharing'
  ].join(' ');
  public auth2: any;

  isLoggedInSource: boolean;
  isLoggedInDest: boolean;

  constructor() { }

  googleInit(element: ElementRef, type: string) {
    return new Promise((resolve, reject) => {
      const that = this;
      gapi.load('auth2', function () {
        that.auth2 = gapi.auth2.init({
          client_id: '1006301797410-kch7quj0vk9pnuh7v5qabclmpj8k6kcc.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: [
            'profile',
            'email',
            // 'https://www.googleapis.com/auth/contacts.readonly',
            // 'https://www.googleapis.com/auth/admin.directory.user.readonly',
            // 'https://www.googleapis.com/auth/photoslibrary.readonly',
            // 'https://www.googleapis.com/auth/photoslibrary.appendonly',
            // 'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
            // 'https://www.googleapis.com/auth/photoslibrary',
            // 'https://www.googleapis.com/auth/photoslibrary.sharing'
            ].join(' ')
          });
          that.googleSignin(element.nativeElement.firstChild, type).then(
            (val) => resolve(val),
            (err) => reject(err)
          );
      });
    });
  }

  googleSignin(element: any, type: string) {
    return new Promise((resolve, reject) => {
      this.auth2.attachClickHandler(element, {}, function (googleUser: any) {
        const profile = googleUser.getBasicProfile();
        if (type === 'src') {
          localStorage.setItem('GoogleTokenSrc', googleUser.getAuthResponse().access_token);
          localStorage.setItem('GoogleIdSrc', profile.getId());
          localStorage.setItem('GoogleToeknExpiresSrc', (new Date(googleUser.getAuthResponse().expires_at)).toString());
          localStorage.setItem('loggedInEmailSrc', profile.U3);
          localStorage.setItem('loggedInImageSrc', profile.Paa);
          localStorage.setItem('isLoggedInSrc', 'true');
          resolve(localStorage.getItem('isLoggedInSrc'));
        } else if (type === 'dest') {
          localStorage.setItem('GoogleTokenDest', googleUser.getAuthResponse().access_token);
          localStorage.setItem('GoogleIdDest', profile.getId());
          localStorage.setItem('GoogleToeknExpiresDest', (new Date(googleUser.getAuthResponse().expires_at)).toString());
          localStorage.setItem('loggedInEmailDest', profile.U3);
          localStorage.setItem('loggedInImageDest', profile.Paa);
          localStorage.setItem('isLoggedInDest', 'true');
          resolve(localStorage.getItem('isLoggedInDest'));
        }
      }, function (error: any) {
        console.log(JSON.stringify(error, undefined, 2));
        reject(JSON.stringify(error, undefined, 2));
      });
    });
  }

  getToken(type: string) {
    return (type === 'src' && new Date() < new Date(localStorage.getItem('GoogleToeknExpiresSrc'))) ? localStorage.getItem('GoogleTokenSrc') : 
      (type === 'dest' && new Date() < new Date(localStorage.getItem('GoogleToeknExpiresDest'))) ? localStorage.getItem('GoogleTokenDest') : '';
  }

  checkLogIn(): boolean {
    return ((JSON.parse(localStorage.getItem('isLoggedInSrc')) && (new Date() < new Date(localStorage.getItem('GoogleToeknExpiresSrc'))))
    && ((JSON.parse(localStorage.getItem('isLoggedInDest'))) && (new Date() < new Date(localStorage.getItem('GoogleToeknExpiresDest'))))) ? true : false;
  }

}


