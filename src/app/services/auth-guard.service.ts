import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(private router:Router, private auth:AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      if (this.auth.authenticated) { return true; }

      return this.auth.currentUserObservable
           .take(1)
           .map(user => !!user)
           .do(loggedIn => {
             if (!loggedIn) {
               console.log("access denied")
               this.router.navigate(["login"]);
             }
         })

  }

}
