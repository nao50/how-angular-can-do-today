import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePositionComponent } from './device-position.component';

describe('DevicePositionComponent', () => {
  let component: DevicePositionComponent;
  let fixture: ComponentFixture<DevicePositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
