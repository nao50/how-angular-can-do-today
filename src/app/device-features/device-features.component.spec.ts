import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceFeaturesComponent } from './device-features.component';

describe('DeviceFeaturesComponent', () => {
  let component: DeviceFeaturesComponent;
  let fixture: ComponentFixture<DeviceFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
