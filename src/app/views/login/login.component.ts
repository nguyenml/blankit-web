import { Component, OnInit, HostBinding } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuthModule, AngularFireAuth} from 'angularfire2/auth';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user= {
    email: '',
    password: ''
  }
  state: string = '';
  error: any;

  constructor(public auth:AuthService,private router: Router) {}

  private afterSignIn():void {
    //Send user away
    this.router.navigate(['']);
  }

  signInWithEmail(): void{
    this.auth.emailLogin(this.user.email, this.user.password).then(() => this.afterSignIn());
  }

  goToSignUp(): void{
    this.router.navigate(['signup']);
  }

  ngOnInit() {}


}
