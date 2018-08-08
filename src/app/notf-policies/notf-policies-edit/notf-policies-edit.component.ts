import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { ActivatedRoute, Router } from '@angular/router';

class NotfPolicy {

  constructor(

      public name:string,
      public threshold:number,
      public probe_id?:string, 
  ){
  }

}
@Component({
  selector: 'app-notf-policies-edit',
  templateUrl: './notf-policies-edit.component.html',
  styleUrls: ['./notf-policies-edit.component.css']
})

export class NotfPoliciesEditComponent implements OnInit {
  
  public data:{};
  private id;

  constructor(private probeService:ProbeService, private router: Router,private route: ActivatedRoute) { 

    this.data = new NotfPolicy('Default Name',2);

    if (this.id = this.route.snapshot.paramMap.get('id')){
      
      this.probeService.describeNotifyPolicy(this.id).subscribe(response=>{
      this.data = response;

    }, error => {
        console.log(error)
      })
    
    }

  }

  onSubmit() {

    let request;

    if (!this.id){
      request = this.probeService.createNotifyPolicy(this.data);
    }  else {
      request = this.probeService.updateNotifyPolicy(this.id, this.data);
    }

    request.subscribe(response=>{
      this.router.navigate(['/notf-policies']);
    }, error => {
      console.log(error)
    })
  }

  ngOnInit() {
  }

}



