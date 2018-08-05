import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupData:User;
  public message = '';

  constructor(private http: HttpClient, private router: Router) { }

  signup() {
    this.http.post('http://localhost:3050/api/signup',this.signupData).subscribe(resp => {
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
}