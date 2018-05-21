import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router' ;
import { Observable} from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarModule } from 'angular-calendar';

import {AuthGuardService} from './services/auth-guard.service';
import {AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {AngularFireAuthModule, AngularFireAuth} from 'angularfire2/auth';
import {AutosizeModule} from 'ngx-autosize';
import { UtilsModule } from '../utils/module';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {environment} from './../environments/environment';

import { AppComponent } from './app.component';

import { AuthService } from './services/auth.service';
import { LoginComponent } from './views/login/login.component';
import { MainComponent } from './views/main/main.component';
import { SignupComponent } from './views/signup/signup.component';
import { AppRoutingModule } from './/app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { LogoutComponent } from './views/logout/logout.component';
import { StatsComponent } from './views/stats/stats.component';
import { EntriesComponent } from './views/entries/entries.component';
import { CalendarComponent } from './views/calendar/calendar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    SignupComponent,
    NavbarComponent,
    LogoutComponent,
    StatsComponent,
    EntriesComponent,
    CalendarComponent
  ],
  imports: [
    UtilsModule,
    BrowserAnimationsModule, 
    CalendarModule.forRoot(),
    AutosizeModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot(),
    FormsModule,
    RouterModule.forRoot([
      { path: "login", component: LoginComponent},
      { path: '', component: MainComponent, canActivate: [AuthGuardService]},
      { path: 'signup', component:SignupComponent},
      { path: 'stats', component:StatsComponent, canActivate: [AuthGuardService]},
      { path: 'entries', component:EntriesComponent, canActivate:[AuthGuardService]},
      { path: 'calendar', component:CalendarComponent, canActivate:[AuthGuardService]}

  ]),
    AppRoutingModule
  ],
  providers: [AuthService,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
