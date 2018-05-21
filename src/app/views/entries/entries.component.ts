import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';
import { DatePipe } from '@angular/common';

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
  click = '';

  constructor(private db:AngularFireDatabase, private auth:AuthService, private router:Router, private datePipe:DatePipe) {
    console.log("hello");
    var entries =  db.list('/Entry', ref => ref.orderByChild('uid').equalTo(this.auth.currentUserId)).valueChanges()
    entries.subscribe(entry => {
      this.entries = entry.reverse()
    });
  }

  ngOnInit() {
  }

  private changeEntry(entry){
    this.entryDate = this.datePipe.transform(Date.parse(entry['date']), 'MMM dd, yyyy');
    this.currentText = entry['text'];
  }

}
