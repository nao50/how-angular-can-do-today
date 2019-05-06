import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglePhotoComponent } from './google-photo.component';

describe('GooglePhotoComponent', () => {
  let component: GooglePhotoComponent;
  let fixture: ComponentFixture<GooglePhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GooglePhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GooglePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
