import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private userInfo = {email:''};

  constructor(public auth: AuthService,private router: Router) { }

  ngOnInit() {
    this.auth.getCurrentUser();
    this.auth.change.subscribe(userInfo => {
      this.userInfo = userInfo;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
  

}
