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

  onSubmit() {

    let request;

    if (!this.id){
      request = this.probeService.createNotifyChannel(this.data);
    }  else {
      request = this.probeService.updateNotifyChannel(this.id, this.data);
    }

    request.subscribe(response=>{
      this.router.navigate(['/notf-channels']);
    }, error => {
      console.log(error)
    })
  }

  ngOnInit() {
  }
}
