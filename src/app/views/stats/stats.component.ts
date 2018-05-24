// @flow
import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  longestStreak:String;
  currentStreak:String;
  wordCount:String;
  totalEntries:String;
  totalTime:String;
  userName:String
  startDate:String

  dateJSON = [{}]

  constructor(private db:AngularFireDatabase, private auth:AuthService, private router:Router) {
  
  }

  ngOnInit() {
    this.displayBestStreak()
    this.displayCurrentStreak()
    this.displayWordCount()
    this.displayTotalDays()
    this.get_time()
    this.displayName()
    this.displayStartDate()
    this.get_timestamps()
  }

  // This function gets and shows the user name
  private displayName(){
    this.userName = this.auth.currentUserDisplayName
  }

  // This function returns the longest streak 
  private displayBestStreak(){
    return this.db.object(`users/${this.auth.currentUserId}/Stats/longestStreak`).valueChanges().take(1).subscribe(data => {
      this.longestStreak = data as String
    })
  }

  // This function returns the current sreak
  private displayCurrentStreak(){
    return this.db.object(`users/${this.auth.currentUserId}/Stats/currentStreak`).valueChanges().take(1).subscribe(data => {
      this.currentStreak = data as String
    })
  }

  // This function returns the total word count
  private displayWordCount(){
    return this.db.object(`users/${this.auth.currentUserId}/Stats/totalWordcount`).valueChanges().take(1).subscribe(data => {
      this.wordCount = data as String
    })
  }

  // This function returns the total entries writen
  private displayTotalDays(){
    return this.db.object(`users/${this.auth.currentUserId}/Stats/totalEntries`).valueChanges().take(1).subscribe(data => {
      this.totalEntries = data as String
    })
  }

  // This function returns the average wordcount 
  private displayWordAverage(){
   this.db.object(`users/${this.auth.currentUserId}/Stats/avgWordcount`).valueChanges().take(1).subscribe(data => {
      
    })
  }

  // This function will return the start date of the user

  private displayStartDate(){
    this.db.object(`users/${this.auth.currentUserId}/Date`).valueChanges().take(1).subscribe(data => {
      this.startDate = data as String
    })
  }



  // This function returns the total time spent writing
  private get_time(){
    return this.db.object(`users/${this.auth.currentUserId}/Stats/totalTime`).valueChanges().take(1).subscribe(data => {
      
      this.displayTotalTime(Number(data))
    })
  }

  // Retrieve entry timestamps
   private get_timestamps() {
     
    return this.db.list('/Entry', ref => ref.orderByChild('uid').equalTo(this.auth.currentUserId)).valueChanges().subscribe(entries => 
      { 
          return entries.map(entry => ({ timestamp: entry['timestamp'] })).map(timestamps=> { 
            const ts:number = Math.round(timestamps.timestamp/1000)
            this.dateJSON.push({ [ts]:1})
            
          })   
    })

  }

  

  private displayTotalTime(seconds){

    var hours = Math.floor(seconds / 3600);
    seconds =  seconds % (3600);
    var minutes = Math.floor(seconds % 3600 / 60);
    var h = hours > 0 ? hours + (hours == 1 ? " hour, " : " hours, ") : "";
    var m = minutes > 0 ? minutes + (minutes == 1 ? " minute, " : " minutes ") : "";
    this.totalTime = h + m
  }

}
