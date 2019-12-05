import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public userInfo = {email:''};
  public navbarOpen = false;

  constructor(public auth: AuthService,private router: Router) { }

  ngOnInit() {

    if(this.auth.loggedIn){
      this.auth.getCurrentUser();
    }

    this.auth.change.subscribe(res => {
      if (res.success){
        this.userInfo = res.data;
      } else {
        this.logout();
      }
    }, err => {
    });
  
  }
  
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
  

}
