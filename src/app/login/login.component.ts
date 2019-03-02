import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { first } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = { email:'', password:'' };
  message = '';
  data: any;

  constructor(private router: Router,public auth: AuthService) { }

  ngOnInit() {
  }

  login() {
   this.auth.login(this.loginData.email, this.loginData.password)
   .pipe(first())
   .subscribe(
     result => this.router.navigate(['']),
     err => {
        this.message = err.error.msg;
      }
   );
  }

}
