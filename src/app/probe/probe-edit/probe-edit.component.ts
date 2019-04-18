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

  methods = ['GET','HEAD','POST','PUT','PATCH','DELETE'];
  locations_list = ['WEST US 2', 'EAST US'];
  probe_id;
  policies:{};

  probeForm = this.fb.group({
    probeURL:['',Validators.required],
    notification_policy_id:[''],
    interval:[''],
    locations:this.fb.group({
      left: false,
      middle: true,
      right: false,  
    }),
    port:['', Validators.required],
    method:[''],
    requestBodyJson:[false],
    requestBody:[''],
    
    headers:this.fb.array([
      this.fb.group({
        key:this.fb.control(''),
        value:this.fb.control('')
      })
    ]),
    matchPolicy:this.fb.group({
      keywords:this.fb.array([
        this.fb.control('')
      ]),
    matchAll:[false]
  }),
    
    basicAuth:this.fb.group({
      user:[''],
      password:['']
    })
  });

  get keywords() {
    return this.probeForm.get('matchPolicy.keywords') as FormArray;
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
  
  probe:Probe = {
    probeURL:'',
    interval:60,
    port:80,
    method:this.methods[0]
  }

  constructor(private probeService:ProbeService, private router: Router,private route: ActivatedRoute, private fb: FormBuilder) {

    this.probeService.listNotifyPolicies().subscribe(response=>{
      this.policies = response;
    }, error => {
        console.log(error)
    });

    if (this.probe_id = this.route.snapshot.paramMap.get('id')){
      
      this.probeService.describeProbe(this.probe_id).subscribe((data:Probe)=>{

        for (let i = 0; i < data.matchPolicy.keywords.length -1; i++){
          this.addKeyword();
        }

        for (let i = 0; i < data.headers.length -1; i++){
          this.addHeader();
        }

        this.probeForm.patchValue(data);

    }, error => {
        console.log(error)
      })
    
    }

  }

  onSubmit() {

    let data:Probe = this.probeForm.value;
    let request;

    if (!this.probe_id){
      request = this.probeService.createProbe(data);
    }  else {
      request = this.probeService.updateProbe(this.probe_id, data);
    }

    request.subscribe(response=>{
      this.router.navigate(['/probes']);
    }, error => {
      console.log(error)
    })
    
  }

  ngOnInit() {
    this.probeForm.patchValue(this.probe);

  }

}
