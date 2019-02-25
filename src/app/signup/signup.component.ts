import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupData:User;
  public message = '';
  private apiUrl = environment.apiUrl
  
  constructor(private http: HttpClient, private router: Router) { }

  resolved(captchaResponse: string) {
    this.signupData.captchaResponse = captchaResponse;
  }
  
  signup() {
    this.http.post(this.apiUrl+'/signup',this.signupData).subscribe(resp => {
      if(resp['success']){
        this.router.navigate(['login']);
      } else {
        this.message = resp['msg'];
      }
    }, err => {
      this.message = err.error.msg;
    });
  }

  ngOnInit() {
    this.signupData = new User();

  }

}


class User {
 public name:String;
 public email: String;
 public password: String;
 public confirmPassword:String;
 public captchaResponse:String;
}