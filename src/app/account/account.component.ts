import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProbeService } from '../probe/probe-service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public userInfo:Object = {email:''};

  constructor(public auth: AuthService, private probeService:ProbeService) { }
  
  ngOnInit() {
    this.probeService.getCurrentUser().subscribe(response=>{
      this.userInfo = response;
    });
  }

}
