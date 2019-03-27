import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  
  public message = '';
  public signupData={
        captchaResponse:'',
        email:'',
      };

  private apiUrl = environment.apiUrl


  constructor(private http: HttpClient, private router: Router) { }

  resolved(captchaResponse: string) {
    this.signupData.captchaResponse = captchaResponse;
  }

  reset() {
    this.http.post(this.apiUrl+'/password/reset',this.signupData).subscribe(resp => {
      if(resp['success']){
        //this.router.navigate(['login']);
        this.message = resp['msg'];

      } else {
        this.message = resp['msg'];
      }
    }, err => {
      this.message = err.error.msg;
    });
  }

  ngOnInit() {
  }

}
