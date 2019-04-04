import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProbeService } from '../probe/probe-service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public userInfo:any = {email:'',password:''};
  public message = '';

  constructor(public auth: AuthService, private probeService:ProbeService) { }
  
  handleForm(){
    console.log(this.userInfo.password);
    this.probeService.updateUserData({password:this.userInfo.password}).subscribe(
      response=> {
        console.log(response);

    }, error => {

    });
  }

  ngOnInit() {
    this.probeService.getCurrentUser().subscribe(response=>{
      this.userInfo = response;
    });
  }

}
