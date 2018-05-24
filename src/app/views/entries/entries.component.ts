import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import * as cal from 'cal-heatmap'

@Component({
  providers: [DatePipe],
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
  entries: any;
  currentText:string = ""; 
  entryDate:string = "";
  wordCount:string
  totalTime:string
  click = '';
  dateJSON = [{}]
  entryJSON = []

  carol = new CalHeatMap()

  constructor(private db:AngularFireDatabase, private auth:AuthService, private router:Router, private datePipe:DatePipe) {
    console.log("1");
    var entries =  db.list('/Entry', ref => ref.orderByChild('uid').equalTo(this.auth.currentUserId)).valueChanges().subscribe(entries => {
      this.entries = entries.reverse()
      return entries.map(entry => ({ timestamp: entry['timestamp'], entry: entry})).map(entry => { 
        const ts:number = Math.round(entry.timestamp/1000)
        this.dateJSON.push({ [ts]:1})
        this.entryJSON.push(entry)
        this.updateCalendar(this.dateJSON)
      })  
    });
    
  }

  ngOnInit() {
    this.createCalendar()
  }

  private changeEntry(entry){
    this.entryDate = this.datePipe.transform(Date.parse(entry['date']), 'MMM dd, yyyy');
    this.currentText = entry['text'];
    this.wordCount = entry['wordcount'];
    this.totalTime = entry['totalTime'];
  }

  private createCalendar(): void {
    var self = this
    this.carol.init({
      itemSelector: "#heatmap",
      start: new Date(2018, 4), // January, 1st 2000
      domain: "month",
      subDomain: "x_day",
      cellSize: 40,
      cellRadius: 3,
	    cellPadding: 5,
      subDomainTextFormat: "%d",
      range: 2,
      weekStartOnMonday: false,
      displayLegend: false,
      domainMargin: 2,
      verticalOrientation: true,
      onClick: function(date, nb) {
        // this is absolutelty not going to work in real life
        // testing purposes
        // does not work IE

        for (let entry of self.entryJSON) {
          
          if (new Date(Math.round(entry.timestamp)).setHours(0,0,0,0) === date.getTime()){
            self.changeEntry(entry.entry)
          }

        }
        //self.changeEntry(self.entryJSON.find(x => new Date(Math.round(x.timestamp)).setHours(0,0,0,0) === date.getTime()).entry)
      }
      
    })
  }

  private updateCalendar(dateJSON): void {
    // change date array to  a single date object
    const dateObj = Object.assign({}, ...dateJSON)
    this.carol.update(dateObj);
  };

}
