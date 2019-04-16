import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../probe-service';
import { Probe } from '../probe';
import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-probe-edit',
  templateUrl: './probe-edit.component.html',
  styleUrls: ['./probe-edit.component.css']
})

export class ProbeEditComponent implements OnInit {

  probeForm = this.fb.group({
    probeURL:['',Validators.required],
    policy:[''],
    interval:[''],
    locations:[''],
    port:['80', Validators.required],
    method:[''],
    postBodyJson:[''],
    postBody:[''],
    
    headers:this.fb.array([
      this.fb.group({
        key:this.fb.control('Accept'),
        value:this.fb.control('')
      })
    ]),

    keywords:this.fb.array([
      this.fb.control('')
    ]),
    exactMatch:[''],
    
    basicAuth:this.fb.group({
      user:[''],
      pass:['']
    })
  });

  get keywords() {
    return this.probeForm.get('keywords') as FormArray;
  }

  addKeyword() {
    this.keywords.push(this.fb.control(''));
  }

  removeKeyword(position){
    this.keywords.removeAt(position);
  }

  get headers() {
    return this.probeForm.get('headers') as FormArray;
  }

  addHeader() {
    this.headers.push(this.fb.group({
      key:this.fb.control(''),
      value:this.fb.control('')
    }));
  }

  removeHeader(position){
    this.headers.removeAt(position);
  }


  methods = ['GET','POST','PUT','HEAD','PATCH','DELETE'];
  locations_list = ['WEST US 2', 'EAST US'];
  probe:any;
  probe_id;
  policies:{};
  

  constructor(private probeService:ProbeService, private router: Router,private route: ActivatedRoute, private fb: FormBuilder) {

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
    console.log(this.probeForm);
    /*
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
    */
  }

  ngOnInit() {

    
  }

}
