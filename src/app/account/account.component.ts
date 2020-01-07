import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../probe/probe-service';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { TabDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  
  public userInfo:any = {email:'',password:''};
  public message = '';
  public terminationConsent;
  public fragment: string;

  constructor(private probeService:ProbeService,private router: Router, private route: ActivatedRoute, public auth: AuthService
    ) {}

  onSelect(data: TabDirective): void {
    
    this.router.navigate( [ '/account' ], { fragment: data.id } )
   
  }

  terminate(){
    
    this.probeService.deleteUser().subscribe(
      response=> {
        this.message = response.msg;
        if(response['success']){
          this.router.navigate(['login']);
        }
    }, error => {
      this.message = error.error.msg;
    });
  }

  ngOnInit() {
    
    this.route.fragment.subscribe(fragment => { 
      this.fragment = fragment; 
    });
    
    this.auth.getCurrentUser();

    this.auth.change.subscribe(res => {
      if (res.success){
        this.userInfo = res.data;
      } else {
        //
      }
    }, err => {
    });

  }

}
