import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../../probe-service';

@Component({
  selector: 'app-probe-edit',
  templateUrl: './probe-edit.component.html',
  styleUrls: ['./probe-edit.component.css']
})

export class ProbeEditComponent implements OnInit {

  constructor() {}

  methods = ['GET','POST','PUT','PATCH','DELETE'];

  probe = new ProbeService('',60,80,this.methods[0]);

  submitted = false;

  onSubmit() { 
    this.submitted = true; 
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.probe); }

  ngOnInit() {}

}
