import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../probe/probe-service';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(public auth: AuthService, private probeService:ProbeService) { }

  public message = '';
  public userInfo:any = {email:'',password:''};

  handleForm(){

    this.probeService.changePassword({newPassword:this.userInfo.password, currentPassword:this.userInfo.currentPassword}).subscribe(
      response=> {
        this.message = response.msg;

        if (response.success){
          this.auth.login(this.userInfo.email, this.userInfo.password).pipe(first())
          .subscribe(
            result => {
              // do something.
            },
            err => {
               this.message = err.error.msg;
             }
          );;
        }

    }, error => {
      this.message = error.error.msg;
    });
  
  
  }

  ngOnInit() {

    this.probeService.getCurrentUser().subscribe(response=>{
      this.userInfo = response;
    });


  }

}
