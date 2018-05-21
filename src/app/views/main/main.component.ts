import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { filter } from 'rxjs/operator/filter';

@Component({
  providers: [DatePipe],
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  // display variables - wordCountLabel, dateLabel 
  wordCountLabel=0;
  dateLabel= "";
  timeout
  currentText:string = "";

  setEntryFlag = false
  entryNumber:String = ""


  private ekey:string;
  entry= {
    date:"",
    text:"",
    timestamp:"",
    totalTime:"",
    uid:"",
    wordcount:"",
    continuedWordcount:""
  };

  constructor(private fdb: FirebaseApp,private db:AngularFireDatabase, private auth:AuthService, private router:Router, private datePipe:DatePipe) {
  }

  ngOnInit() {
    this.displayDate();
    this.didWriteToday();
    this.displayTotalDays()
  }

  //This function will get the data from the latest entry
  private get_entry(){
    this.get_lastAccess().then(res => {
      this.db.object(`Entry/${res}`).valueChanges().first().subscribe(data => {
        this.setEntry(data);
      })
    });
  }

  // This function will find out if the user wrote an entry today.
  private didWriteToday(){
    var dateTime:any
    this.db.object(`users/${this.auth.currentUserId}`).valueChanges().take(1).subscribe(res => {
      dateTime = res['LastAccess'];
      dateTime = (Date.parse(dateTime));
      var today:any = this.datePipe.transform(Date(), 'MMM dd, yyyy h:mm a');
      today = (Date.parse(today))
      if (this.sameDate(dateTime,today)){
        this.get_entry()
      } 
    })
    
  }

  // This function will find out the last entry that the user has written.
  private get_lastAccess() {
    return this.db.object(`users/${this.auth.currentUserId}`).valueChanges().take(1).map(res => {
      this.ekey = res['LastEntry'];
      return res['LastEntry']
    }).first().toPromise();
  }

  // This function will set the entry to the data taken from the latest entry retrieved.
  private setEntry(data){      
    this.entry.date = data['date'];
    this.entry.text = data['text'];
    this.entry.timestamp = data['timestamp'];
    this.entry.totalTime = data['totalTime'];
    this.entry.uid = data['uid'];
    this.entry.wordcount, this.entry.continuedWordcount = data['wordcount'];
    this.displayEntry()
  }

  private displayEntry(){
    this.currentText = this.entry.text
    this.wordcount(this.currentText)
    
  }

  // This function will send an entry to the db.
  private sendEntry() {
    
    this.entry.date = this.datePipe.transform(Date(), 'MMM dd, yyyy h:mm a');
    this.entry.wordcount = this.wordCountLabel.toString()
    this.entry.uid = this.auth.currentUserId

    //on IOS this is negative for some reason
    this.entry.timestamp = Date.now().toString()
    this.entry.text = this.currentText

    //  Need to implement time tracking on page
    this.entry.totalTime = "300"
    //------------------------------------------

    if(this.ekey){
      // update the entry object
      const updateEntry = this.db.object(`Entry/${this.ekey}`).update(this.updateEntry())
      this.updateUserLastAccess(this.ekey)
      this.updateUserStatsContinued()
      console.log("update");
      
    } else {
      //or send it
      const sentEntry = this.db.list('Entry').push(this.entry)
      this.ekey = sentEntry.key
      this.updateUserLastAccess(sentEntry.key)
      this.updateUserStats()
      console.log("send it");
      
    }
    
  }

  // Updates the entry that is already on the DB for the user that day.
  private updateEntry(){
    return { "date":this.entry.date,
    "text":this.entry.text,
    "timestamp":this.entry.timestamp ,
    "totalTime":this.entry.totalTime ,
    "uid":this.entry.uid ,
    "wordcount":this.entry.wordcount ,
    }
  }

  // This function will update the users last access to match the current date and set the current entry key.
  private updateUserLastAccess(key) {
    this.db.object(`users/${this.auth.currentUserId}`).update({"LastAccess":this.datePipe.transform(Date(), 'MMM dd, yyyy h:mm a')})
    this.db.object(`users/${this.auth.currentUserId}`).update({"LastEntry":key.toString()})
  }

  // This function will update the users wordcount, time, entries, streaks on their first entry of the day.
  private updateUserStats(){
    const ref = this.fdb.database().ref(`users`).child(this.auth.currentUserId).child('Stats');
    ref.transaction(stats => {
      if (stats != null) {
        let totalEntries = stats['totalEntries'];
        let totalWordcount = stats['totalWordcount'];
        let currentStreak = stats['currentStreak'];
        let longestStreak = stats['longestStreak'];
        
        // implement time here 
  
        //
  
        stats['totalWordcount'] = totalWordcount + this.wordCountLabel ;
        stats['totalEntries'] = totalEntries + 1;
        stats['currentStreak'] = currentStreak + 1;
        stats['longestStreak'] = longestStreak + 1;
  
        return stats
    } else {
        // Return a value that is totally different 
        // from what is saved on the server at this address:log
      
        return 0;
    }
      
    }, function(error, committed, snapshot) {
      if (error) {
          console.log("error in transaction");
      } else if (!committed) {
          console.log("transaction not committed");
      } else {
          console.log("Transaction Committed");
      }
  }, true);
  }

  // This function will update the users wordcount, time, entries, streaks if they have aready written that day.
  private updateUserStatsContinued(){
    const ref = this.fdb.database().ref(`users`).child(this.auth.currentUserId).child('Stats');
    ref.transaction(stats => {
      if (stats != null) {
        let totalWordcount = stats['totalWordcount'];
        stats['totalWordcount'] = totalWordcount + this.wordCountLabel - Number(this.entry.continuedWordcount);
        return stats
    } else {
        // Return a value that is totally different 
        // from what is saved on the server at this address:log      
        return 0;
    }
      
    }, function(error, committed, snapshot) {
      if (error) {
          console.log("error in transaction");
      } else if (!committed) {
          console.log("transaction not committed");
      } else {
          console.log("Transaction Committed");
      }
  }, true);
  }

  // This function will set and display the entry Number or the day that the user is on.
  private displayTotalDays(){
    this.db.object(`users/${this.auth.currentUserId}/Stats/totalEntries`).valueChanges().take(1).subscribe(data => {
      this.entryNumber = data as String
    })
  }

  // This function gets the current date and displays it in the top right corner.
  private displayDate(): void {
    var m_names = new Array("Jan", "Feb", "Mar", 
    "Apr", "May", "Jun", "Jul", "Aug", "Sep", 
    "Oct", "Nov", "Dec");

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    
    this.dateLabel = (m_names[curr_month] 
    + " " + curr_date + ", " + curr_year);
  }

  // This function gets the current wordcount of the entry, and updates every time the user types.
  private wordcount(value:String) {
      this.currentText = value.toString()
       var text = value, count = text.trim().replace(/\s+/g, ' ').split(' ').length;
       if (text == ""){
        count = 0;
       }
       this.wordCountLabel = count;
       this.autoWait()
  }

  // Compares to timestamps to see if they are of the same day.
  private sameDate(day,today):boolean{
      var previous = new Date(day).setHours(0, 0, 0, 0);
      var current = new Date().setHours(0, 0, 0, 0);

      if(current === previous){
          return true;
      } 
      return false;
  }

  private autoWait(){
      if (!this.setEntryFlag){
        this.setEntryFlag = true
        return
      }
      clearTimeout(this.timeout);
      var self = this
      this.timeout = setTimeout(function() {
        // Runs 1 second (1000 ms) after the last change    
        self.saveToDB();
    }, 5000);

  };

  saveToDB()
  {
      console.log('Saving to the db');  
       this.sendEntry()  
  }

}
