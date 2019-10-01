import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  constructor( private router: ActivatedRoute, private http:HttpClient) { }

  private token = this.router.snapshot.paramMap.get('token');
  private apiUrl = environment.apiUrl;
  
  public message:string;
  public title:string;
  public success:boolean;

  verify() {
    this.http.get(this.apiUrl+'/confirmation/'+this.token).subscribe(resp => {
      
      if(resp['success']){
        this.title = 'Successful Confirmation';
        this.success = true;
        this.message = resp['msg'];
      }
    }, err => {
      this.title = 'Oops! Something went wrong.';
      this.success = false;
      this.message = err.error.msg;
    });
  }
  
  ngOnInit() {
    this.verify();
  }

}
