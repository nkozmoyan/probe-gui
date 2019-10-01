import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { ProbeService } from '../probe/probe-service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public message = '';
  public switchExpression:string = 'form';
  public formData:Object = {
    pwd:String,
    confirmPwd:String
  };

  private token:String;

  constructor(private router: ActivatedRoute, private probeService:ProbeService) { }

  reset(){
    this.probeService.setPassword(this.token, this.formData).subscribe(response=>{
      this.switchExpression = 'success';
      }, err => {
          this.message = err.error.msg;
      });
  }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.token  = params['token'];

        this.probeService.checkPasswordResetTokenValidity(this.token).subscribe(response=>{
        if(response.status === 200)
          this.switchExpression = 'form';
        else
          this.switchExpression = 'invalid-token';
    }, error => {
          this.switchExpression = 'invalid-token';
      });
    });
  
  }

}
