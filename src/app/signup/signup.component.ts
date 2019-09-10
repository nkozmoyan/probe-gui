import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';
import { ProbeService } from '../probe/probe-service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupData:User;
  public message = '';
  public apiUrl = environment.apiUrl
  public viewMode = 'form';
  public dibsableButton = false;
  public success = false;

  constructor(private http: HttpClient, private router: Router, private probeService:ProbeService) { }

  resolved(captchaResponse: string) {
    this.signupData.captchaResponse = captchaResponse;
  }
  
  signup() {
    this.http.post(this.apiUrl+'/signup',this.signupData).subscribe(resp => {
      if(resp['success']){
        this.viewMode = 'feedback';
        this.success = true;
      } 
      
      this.message = resp['msg'];
  
    }, err => {
      this.message = err.error.msg;
    });
  }

  resendToken(){

    this.dibsableButton = true;

    setTimeout(()=>{
      this.dibsableButton = false;
    },3000)
    
    if(!this.signupData.email){
      this.message = 'No email to verify.';
      return false;
    }

    this.probeService.resendToken({email:this.signupData.email}).subscribe(resp => {
      if(resp['success']){
        this.viewMode = 'feedback';
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