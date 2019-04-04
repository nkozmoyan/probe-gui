import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProbeService } from '../probe/probe-service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public userInfo:any = {email:'',password:''};
  public message = '';

  constructor(public auth: AuthService, private probeService:ProbeService) { }
  terminate(){
    console.log("terminate");
  }
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
