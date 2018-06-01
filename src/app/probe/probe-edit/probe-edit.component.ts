import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../probe-service';
import { Probe } from '../probe';

@Component({
  selector: 'app-probe-edit',
  templateUrl: './probe-edit.component.html',
  styleUrls: ['./probe-edit.component.css']
})

export class ProbeEditComponent implements OnInit {

  constructor(private probeService:ProbeService) {}

  methods = ['GET','POST','PUT','PATCH','DELETE'];

  probe = new Probe('',60,80,this.methods[0]);

  submitted = false;

  onSubmit() {
    console.log(this.probe); 
    this.submitted = true; 

    this.probeService.createProbe(this.probe).subscribe(response=>{
      console.log(response)
    }, error => {
      console.log(error)
    })
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.probe); }

  ngOnInit() {}

}
