import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { ActivatedRoute, Router } from '@angular/router';

class NotfChannel {

  constructor(

      public name:string,
      public type:string,
      public channel:string, 
      public policies?:string[], 
  ){
  }

}
@Component({
  selector: 'app-notf-channels-edit',
  templateUrl: './notf-channels-edit.component.html',
  styleUrls: ['./notf-channels-edit.component.css']
})
export class NotfChannelsEditComponent implements OnInit {

  public data:any;
  public types = ['E-mail','SMS','Webhook'];
  private id;
  public viewMode = 'form';
  public dibsableButton = false;
  public message = '';
  public channelId;

  constructor(private probeService:ProbeService, private router: Router,private route: ActivatedRoute) { 

    this.data = new NotfChannel('','E-mail','');

    if (this.id = this.route.snapshot.paramMap.get('id')){
      
      this.probeService.describeNotifyChannel(this.id).subscribe(response=>{
      this.data = response;

    }, error => {
        console.log(error)
      })
    
    }

  }

  
  resendConfirmation(){

    this.dibsableButton = true;

    setTimeout(()=>{
      this.dibsableButton = false;
    },3000)
    
    if(!this.channelId){
      this.message = 'No email to verify.';
      return false;
    }

    this.probeService.resendConfirmation({channelId:this.channelId}).subscribe(resp => {
      if(resp['success']){
        this.message = resp['msg'];
      } 
  
    }, err => {
      this.message = err.error.msg;
    });
  }

  onVerify(){
    this.probeService.confirmToken(this.data.code).subscribe(resp=>{
      this.message = resp.msg;
    }, err=>{
      this.message = err.error.msg;

    })
  }

  onSubmit() {

    let request;

    if (!this.id){
      request = this.probeService.createNotifyChannel(this.data);
    }  else {
      request = this.probeService.updateNotifyChannel(this.id, this.data);
    }

    request.subscribe(response=>{
      this.viewMode = 'feedback';
      this.channelId = response['_id'];
      //this.router.navigate(['/notf-channels']);
    }, error => {
      this.message = error.error.msg;

    })
  }

  ngOnInit() {
  }
}
