import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../probe-service';
import { Probe } from '../probe';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-probe-edit',
  templateUrl: './probe-edit.component.html',
  styleUrls: ['./probe-edit.component.css']
})

export class ProbeEditComponent implements OnInit {
  
  public methods = ['GET','POST','PUT','PATCH','DELETE'];
  public locations_list = ['US-EAST','US-WEST'];
  public probe:any;
  private probe_id;
  public policies:{};
  

  constructor(private probeService:ProbeService, private router: Router,private route: ActivatedRoute) {

    this.probeService.listNotifyPolicies().subscribe(response=>{
      this.policies = response;
    }, error => {
        console.log(error)
    });

    this.probe = new Probe('',60,80,this.methods[0],{keywords:[], exactMatch:false});

    if (this.probe_id = this.route.snapshot.paramMap.get('id')){
      
      this.probeService.describeProbe(this.probe_id).subscribe(response=>{
        this.probe = response;
    }, error => {
        console.log(error)
      })
    
    }

  }
  get diagnostic() { return JSON.stringify(this.probe); }

  onSubmit() {

    let request;

    if (!this.probe_id){
      request = this.probeService.createProbe(this.probe);
    }  else {
      request = this.probeService.updateProbe(this.probe_id, this.probe);
    }

    request.subscribe(response=>{
      this.router.navigate(['/probes']);
    }, error => {
      console.log(error)
    })
  }

  ngOnInit() {

    
  }

}
