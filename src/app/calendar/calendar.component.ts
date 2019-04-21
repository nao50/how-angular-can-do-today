import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class CalendarComponent implements OnInit {
  calendars = [
    {value: 'Google Calendar'},
    {value: 'iCal'},
    {value: 'Outlook'},
  ];

  calendarFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private adapter: DateAdapter<any>,
  ) {
    this.calendarFormGroup = this.formBuilder.group({
      title: [''],
      calender: ['Google Calendar', [Validators.required]],
      startDate: [new Date()],
      startTime: ['Google Calendar'],
      endDate: [new Date()],
      endTime: [''],
    });
  }

  ngOnInit() {
  }
  // http://www.google.com/calendar/event?
  // location=BONFIM+Ochiaiminaminagasaki+%E8%90%BD%E5%90%88%E5%8D%97%E9%95%B7%E5%B4%8E++-+%E3%80%92171-0052+%E6%9D%B1%E4%BA%AC%E9%83%BD%E8%B1%8A%E5%B3%B6%E5%8C%BA%E5%8D%97%E9%95%B7%E5%B4%8E4-5-20+iTerrace+5F%2C+Tokyo+-+Tokyo%2C+jp&
  // action=TEMPLATE&
  // sprop=name%3A%E3%83%95%E3%83%83%E3%83%88%E3%82%B5%E3%83%AB+%E6%9D%B1%E4%BA%AC%E3%80%80Futsal+Tokyo&
  // sprop=website%3Ahttps%3A%2F%2Fwww.meetup.com%2FFutsal-Tokyo%2Fevents%2F259469630&
  // details=For+full+details%2C+including+the+address%2C+and+to+RSVP+see%3A+https%3A%2F%2Fwww.meetup.com%2FFutsal-Tokyo%2Fevents%2F259469630%0A%0AWe+are+a+mixed+group+of+local+and+international+players%2C+whatever+your+skill+level%2C+everyone+is+welc...&
  // text=%E2%9A%BD+Sunday+Futsal+1+%28Outdoor%29+%40+BONFIM+Ochiaiminaminagasak%C2%AD%C2%ADi&
  // dates=20190414T080000Z%2F20190414T100000Z
}


