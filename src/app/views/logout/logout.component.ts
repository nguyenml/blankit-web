import { Component, OnInit, HostBinding } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuthModule, AngularFireAuth} from 'angularfire2/auth';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(public auth:AuthService) {}
  ngOnInit() {}

  logout(){

    this.auth.signOut();
  }

}
