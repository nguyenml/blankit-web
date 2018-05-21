import { Component, OnInit } from '@angular/core';
import { AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule, AngularFireAuth} from 'angularfire2/auth';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  state: string = '';
  error: any;

  constructor(public auth:AuthService,private router: Router) {}

  private afterSignUp():void {
    //Send user away
    this.router.navigate(['']);
  }

  onSubmit(formData) {
    if(formData.valid) {
      console.log(formData.value);
      this.auth.emailSignUp(formData.value.email,formData.value.password,formData.value.name).then(
        (success) => {
        console.log(success);
        this.router.navigate([''])
      }).catch(
        (err) => {
        console.log(err);
        this.error = err;
      }).then(() => this.afterSignUp());
    }
  }

  ngOnInit() {
  }

}
