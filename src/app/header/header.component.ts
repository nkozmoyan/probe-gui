import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ProbeService } from '../probe/probe-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public userInfo:Object = {email:''};

  constructor(public auth: AuthService, private router: Router, private probeService:ProbeService) { }
  
  ngOnInit() {
    this.probeService.getCurrentUser().subscribe(response=>{
      this.userInfo = response;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

}
