import { Component, OnInit } from '@angular/core';
import {LogoutComponent} from '../views/logout/logout.component'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private auth:AuthService) {
    this.displayName = this.auth.currentUserDisplayName
   }

  displayName:String

  ngOnInit() {
  }

}
