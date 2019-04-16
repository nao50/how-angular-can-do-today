import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAndValidationComponent } from './form-and-validation.component';

describe('FormAndValidationComponent', () => {
  let component: FormAndValidationComponent;
  let fixture: ComponentFixture<FormAndValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAndValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAndValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
