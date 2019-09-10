import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProbeService } from '../../probe/probe-service';
import { ActivatedRoute, Router } from '@angular/router';

class NotfPolicy {

  constructor(

      public name:string,
      public threshold_loc:number,
      public threshold_policy:number,
      public probe_id?:string, 
      public recovery?:boolean,
      public continuous?:boolean,
      public channel_ids?:string[]

  ){
  }

}
@Component({
  selector: 'app-notf-policies-edit',
  templateUrl: './notf-policies-edit.component.html',
  styleUrls: ['./notf-policies-edit.component.css']
})

export class NotfPoliciesEditComponent implements OnInit {
  
  public data:any;
  public channels:any;
  private ref;

  private id;

  formGroup = this.fb.group({
    name:['',Validators.required],
    threshold_loc:[2,Validators.required],
    threshold_policy:[2,Validators.required],
    recovery:[false,Validators.required],
    continuous:[false,Validators.required],
    channel_ids:this.fb.group({}),

  });

  constructor(private probeService:ProbeService, private router: Router,private route: ActivatedRoute, private fb: FormBuilder) { 
    

  
  }
  get diagnostic() { return JSON.stringify(this.data); }

  onSubmit() {

    let request;
    
    let data: NotfPolicy;

    data = {
      name:this.formGroup.controls.name.value,
      threshold_loc:this.formGroup.controls.threshold_loc.value,
      threshold_policy:this.formGroup.controls.threshold_policy.value,
      continuous:this.formGroup.controls.continuous.value,
      recovery:this.formGroup.controls.recovery.value,
      channel_ids:Object.keys(this.formGroup.controls.channel_ids.value).filter(key=> this.formGroup.controls.channel_ids.value[key])
      
    }
    
    if (!this.id){
      request = this.probeService.createNotifyPolicy(data);
    }  else {
      request = this.probeService.updateNotifyPolicy(this.id, data);
    }

    request.subscribe(()=>{

      if(this.ref){
        //this.router.navigate(['/probes/' + this.ref]);
        this.router.navigate(['/probes/']);
      } else {
        this.router.navigate(['/notf-policies']);
      }
     
    }, error => {
        console.log(error);
    })
  }

  ngOnInit() {

    this.data = new NotfPolicy('Default Name', 2, 2, null, true, false);

    this.probeService.listNotifyChannels().subscribe(response=>{
        
      this.channels = response;

      const formChannels = this.formGroup.get('channel_ids') as FormGroup;
            
      this.channels.forEach(channel => {
        formChannels.addControl(channel._id,this.fb.control(false));
      });

      if (this.id = this.route.snapshot.paramMap.get('id')){
        
        this.ref = this.route.snapshot.queryParams.ref;

        this.probeService.describeNotifyPolicy(this.id).subscribe(response=>{

          if(response!=null){
            this.data = response;
            this.data.channel_ids = this.data.channel_ids.reduce((o, key) => ({ ...o, [key]:true}), {});
            this.formGroup.patchValue(this.data);
          } else 
          {
            console.log('Not found');
          }

        }, 
      
        error => {
            console.log(error)
        }
        
        )
      
      } 

    }, error => {
        console.log(error)
    })



  }

}



