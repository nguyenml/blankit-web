import { Injectable } from '@angular/core';
import{Router} from '@angular/router';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { FirebaseDatabase } from '@firebase/database-types';

@Injectable()
export class AuthService{
 
  authState: any = null;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private router:Router) {

            this.afAuth.authState.subscribe((auth) => {
              this.authState = auth
            });
          }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  emailSignUp(email:string, password:string, displayName:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        user.updateProfile({
          displayName: displayName
        }).then(() => {
          this.authState = user
          this.updateUserData()
        })
      })
      .catch(error => console.log(error));
  }

  emailLogin(email:string, password:string) {
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((user) => {
         this.authState = user
       })
       .catch(error => console.log(error));
  }

  signOut():void{
    this.afAuth.auth.signOut();
    this.router.navigate(['login'])

  }

  private updateUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
      let path = `users/${this.currentUserId}`; // Endpoint on firebase
      let data = {
                    Date: Date(),
                    Email: this.authState.email,
                    Name: this.authState.displayName,
                    LastAccess: "Apr 1, 2017 11:00 AM",
                    Provider: "email",
                    Stats:{
                      currentStreak:0,
                      longestStreak:0,
                      avgWordcount:0,
                      totalEntries:0,
                      totalTime:0,
                      totalWordcount:0
                    },
                    Badges:{}
                  }
  
      this.db.object(path).update(data)
      .catch(error => console.log(error));
  
    }

}
