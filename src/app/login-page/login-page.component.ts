import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import * as _ from 'lodash';
import { AuthService } from '../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export class StateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  constructor(
    private readonly authService: AuthService, 
    private _snackBar: MatSnackBar,
    private router: Router){}
  emailFormControl = new FormControl('', [Validators.required, Validators.email])
  passwordFormControl = new FormControl('', [Validators.required])
  jwtHelper = new JwtHelperService();
  
  errorMatcher = new StateMatcher()
  
  requirements: any[] = [
    { name: 'Mail ID', type: 'email', control: this.emailFormControl }, 
    { name: 'Password', type: 'password', control: this.passwordFormControl},
  ];
  output: any = {};

  submit(){
    if(this.emailFormControl.errors === null && this.passwordFormControl.errors === null) {
      const authenticated = this.authService.signIn(this.emailFormControl.value, this.passwordFormControl.value)

      authenticated.subscribe(response => {
        if(response){
          this.authService.setToken(response.access_token)
          this.router.navigate(['/home']);
        }
        else{
          this._snackBar.open(
            'Failed to login. Please try again' , 'Close',
            { 
              horizontalPosition: 'left',
              duration: 3000,
              politeness: 'assertive',
            }
          )
        }
      })
    }
    
  }
}
