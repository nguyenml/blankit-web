import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { DayViewHour } from 'calendar-utils';
import { subMonths, addMonths, addDays, addWeeks, subDays, subWeeks, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import {AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';

type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths
  }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths
  }[period](date, amount);
}

interface Entry {
  text: string;
  date: string;
  time: string;
  wordcount: string;
}

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent {
  view: CalendarPeriod = 'month';

  viewDate: Date = new Date()

  selectedMonthViewDay: CalendarMonthViewDay;

  selectedDayViewDate: Date;

  dayView: DayViewHour[];

  events: CalendarEvent[] = [
    {
      title: 'Click me',
      start: new Date()
    },
    {
      title: 'Or click me',
      start: new Date()
    }
  ];

  constructor(private db:AngularFireDatabase, private auth:AuthService, private router:Router) {}

  fetchEvents(){
    this.db.list('/Entry', ref => ref.orderByChild('uid').equalTo(this.auth.currentUserId)).valueChanges().subscribe(entries => {
         Object.keys(entries).map(key=>entries[key]).map(entry => {
            
            
        })
    });
  }

  ngOnInit() {
   //this.fetchEvents()
  }

  dayClicked(day: CalendarMonthViewDay): void {
    console.log(day);
    
    if (this.selectedMonthViewDay) {
      delete this.selectedMonthViewDay.cssClass;
    }
    day.cssClass = 'cal-day-selected';
    this.selectedMonthViewDay = day;
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (
        this.selectedMonthViewDay &&
        day.date.getTime() === this.selectedMonthViewDay.date.getTime()
      ) {
        day.cssClass = 'cal-day-selected';
        this.selectedMonthViewDay = day;
      }
    });
  }

  hourSegmentClicked(date: Date) {
    this.selectedDayViewDate = date;
    this.addSelectedDayViewClass();
  }

  beforeDayViewRender(dayView: DayViewHour[]) {
    this.dayView = dayView;
    this.addSelectedDayViewClass();
  }

  increment(): void {
    this.changeDate(addPeriod(this.view, this.viewDate, 1));
  }

  decrement(): void {
    this.changeDate(subPeriod(this.view, this.viewDate, 1));
  }

  changeDate(date: Date): void {
    this.viewDate = date;
  }

  private addSelectedDayViewClass() {
    this.dayView.forEach(hourSegment => {
      hourSegment.segments.forEach(segment => {
        delete segment.cssClass;
        if (
          this.selectedDayViewDate &&
          segment.date.getTime() === this.selectedDayViewDate.getTime()
        ) {
          segment.cssClass = 'cal-day-selected';
        }
      });
    });
  }
}