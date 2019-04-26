import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit, AfterViewInit {
  usingBrowser: string;
  @ViewChildren('section') sections: QueryList<ElementRef>;

  readonly images = [
    '//via.placeholder.com/800x800',
    '//via.placeholder.com/700x700',
    '//via.placeholder.com/600x600',
    '//via.placeholder.com/500x500',
    '//via.placeholder.com/400x400'
  ];

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    console.log('platform:', window.navigator.platform);
    console.log('language:', window.navigator.language);
    console.log('userAgent:', window.navigator.userAgent);


    // Chack using browser
    const agent = window.navigator.userAgent.toLowerCase();
    const version = window.navigator.appVersion.toLowerCase();
    if (agent.indexOf('msie') > -1) {
      if (version.indexOf('msie 6.') > -1) {
        this.usingBrowser = 'IE6';
      } else if (version.indexOf('msie 7.') > -1) {
        this.usingBrowser = 'IE7';
      } else if (version.indexOf('msie 8.') > -1) {
        this.usingBrowser = 'IE8';
      } else if (version.indexOf('msie 9.') > -1) {
        this.usingBrowser = 'IE9';
      } else if (version.indexOf('msie 10.') > -1) {
        this.usingBrowser = 'IE10';
      } else {
        this.usingBrowser = 'IE(バージョン不明)';
      }
    } else if (agent.indexOf('trident/7') > -1) {
      this.usingBrowser = 'IE11';
    } else if (agent.indexOf('edge') > -1) {
      this.usingBrowser = 'Edge';
    } else if (agent.indexOf('chrome') > -1) {
      this.usingBrowser = 'Chrome';
    } else if (agent.indexOf('safari') > -1) {
      this.usingBrowser = 'Safari';
    } else if (agent.indexOf('opera') > -1) {
      this.usingBrowser = 'Opera';
    } else if (agent.indexOf('firefox') > -1) {
      this.usingBrowser = 'Firefox';
    }

  }

  ngAfterViewInit(): void {
    const s = document.createElement('script');
    const st = document.createTextNode("!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');");
    s.appendChild(st);
    this.elementRef.nativeElement.appendChild(s);
  }


  getButtonColor(even: boolean) {
    return even ? 'primary' : 'accent';
  }

  scrollNextSectionIntoView(currentIndex: number) {
    const nextSection = this.findNextSection(currentIndex);
    this.scrollElIntoView(nextSection);
  }

  hasNextSection(currentIndex: number) {
    return currentIndex < this.images.length - 1;
  }

  private findNextSection(currentIndex: number): HTMLElement {
    const nextIndex = currentIndex + 1;
    const sectionNativeEls = this.getSectionsNativeElements();
    return sectionNativeEls[nextIndex];
  }

  private getSectionsNativeElements() {
    return this.sections.toArray().map(el => el.nativeElement);
  }

  private scrollElIntoView(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

}
