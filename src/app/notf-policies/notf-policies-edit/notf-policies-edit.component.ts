import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProbeService } from '../../probe/probe-service';
import { ActivatedRoute, Router } from '@angular/router';

class NotfPolicy {

  constructor(

      public name:string,
      public thresholdLoc:number,
      public thresholdPolicy:number,
      public probeId?:string, 
      public recovery?:boolean,
      public continuous?:boolean,
      public channelIds?:string[]

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
    thresholdLoc:[2,Validators.required],
    thresholdPolicy:[2,Validators.required],
    recovery:[false,Validators.required],
    continuous:[false,Validators.required],
    channelIds:this.fb.group({}),

  });

  constructor(private probeService:ProbeService, private router: Router,private route: ActivatedRoute, private fb: FormBuilder) { 
    

  
  }
  get diagnostic() { return JSON.stringify(this.data); }

  onSubmit() {

    let request;
    
    let data: NotfPolicy;

    data = {
      name:this.formGroup.controls.name.value,
      thresholdLoc:this.formGroup.controls.thresholdLoc.value,
      thresholdPolicy:this.formGroup.controls.thresholdPolicy.value,
      continuous:this.formGroup.controls.continuous.value,
      recovery:this.formGroup.controls.recovery.value,
      channelIds:Object.keys(this.formGroup.controls.channelIds.value).filter(key=> this.formGroup.controls.channelIds.value[key])
      
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

      const formChannels = this.formGroup.get('channelIds') as FormGroup;
            
      this.channels.forEach(channel => {
        formChannels.addControl(channel._id,this.fb.control(false));
      });

      if (this.id = this.route.snapshot.paramMap.get('id')){
        
        this.ref = this.route.snapshot.queryParams.ref;

        this.probeService.describeNotifyPolicy(this.id).subscribe(response=>{

          if(response!=null){
            this.data = response;
            this.data.channelIds = this.data.channelIds.reduce((o, key) => ({ ...o, [key]:true}), {});
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



