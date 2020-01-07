import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../probe-service';
import { Probe } from '../probe';
import { ActivatedRoute, Router } from '@angular/router';
import { httpHeadersList } from '../http-headers-list';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Options } from 'ng5-slider';
import { NotificationPolicy, MessageBox } from '../../interface/interface';


@Component({
  selector: 'app-probe-edit',
  templateUrl: './probe-edit.component.html',
  styleUrls: ['./probe-edit.component.css', './styled-slider.component.scss']
})

export class ProbeEditComponent implements OnInit {

  private httpHeadersList = httpHeadersList;

  constructor(
    private probeService:ProbeService, 
    private router: Router,
    private route: ActivatedRoute, 
    private fb: FormBuilder) {
  }

  public methods = ['GET','HEAD','POST','PUT','PATCH','DELETE'];
  
  locationsList;
  probeId;
  policies:NotificationPolicy[] = [];
  interval;
  errorMsg:string='';
  userInfo:any;

  messageBoxData:MessageBox = {
    title:'',
    message:'',
    icon:'',
    buttons:{
      primary:{
        label:''
      },
      cancel:{
        label:''
      }
    }
  };

  options: Options = {
    floor: 60,
    step:60,
    ceil: 300,
    showTicks: true,
    hidePointerLabels:true,
    hideLimitLabels:true,
    getLegend: (value: number): string => {
      return value/60 + ' min';
    }
  };

  probeForm = this.fb.group({
    probePrefix:['http://'],
    name:[''],
    probeURL:['',{
      updateOn:'blur',
      validators:[Validators.required, Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)]
    }],
    notificationPolicyId:[''],
    interval:[''],
    locations:this.fb.group({},{validators:this.loactionSelectionValidator}),
    port:['80', Validators.required],
    method:[this.methods[0], Validators.required],
    requestBodyJson:[''],
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

    policyChoice:['existing'],
    
    basicAuth:this.fb.group({
      user:[''],
      password:['']
    })
  });

  messageBoxAction(action){
    if(action === 'primary')
      this.router.navigate(['/account'], { fragment:'subscription' })
    else 
      this.router.navigate(['/probes']);
  }

  loactionSelectionValidator(g: FormGroup) {
    
    let selectedCount:number =0;    
    
    Object.keys(g.controls).forEach(control=>{
      selectedCount += g.get(control).value as number;
    });

    if (selectedCount<2) 
      return {'notEnoughLocations': true}; 
    else 
      return null;
  }

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

  createPolicy(next){

    let data = {
      name:'New Policy-' + this.probeForm.value.probeURL.substring(0,12),
      thresholdLoc:2,
      thresholdPolicy:2,
    }
      
    let request = this.probeService.createNotifyPolicy(data);
      
    request.subscribe( resp => {
      next(null, resp);
    }, err => {
      next(err, null);
    })

  }

  createOrUpdateProbe(data:Probe,next){

    let request;

    if (!this.probeId){
      request = this.probeService.createProbe(data);
    }  else {
      request = this.probeService.updateProbe(this.probeId, data);
      
    }

    request.subscribe(resp=>{
      next(null, resp);
    }, error => {
      next(error, null);
    })
    

  }

  onSubmit() {

    let data:Probe = {
      name:this.probeForm.value.name,
      probePrefix:this.probeForm.value.probePrefix,
      probeURL:this.probeForm.value.probeURL,
      interval:this.probeForm.value.interval,
      port:this.probeForm.value.port,
      method:this.probeForm.value.method,
      locations:Object.keys(this.probeForm.value.locations).filter(key => this.probeForm.value.locations[key]),
      notify:!(this.probeForm.value.policyChoice === 'none')
    }
    
    if (this.probeForm.value.notificationPolicyId){
      data.notificationPolicyId = this.probeForm.value.notificationPolicyId;
    }

    let headers = this.probeForm.value.headers.filter(elem => {
          return (elem.key && elem.value)
      })

    if (headers.length){
      data.headers = headers;
    } else {
      data.headers = [];
    }
      
    let keywords = this.probeForm.value.matchPolicy.keywords.filter(elem =>{
      return elem;
    });

    data.matchPolicy = {
      keywords:keywords,
      matchAll:this.probeForm.value.matchPolicy.matchAll
    }
   
    data.requestBody = this.probeForm.value.requestBody;

    if (this.probeForm.value.requestBodyJson){
      data.requestBodyJson = this.probeForm.value.requestBodyJson;
    } else {
      data.requestBodyJson = false;
    }

    if (this.probeForm.value.basicAuth.user || this.probeForm.value.basicAuth.password){
      data.basicAuth = {
        user:this.probeForm.value.basicAuth.user,
        password:this.probeForm.value.basicAuth.password
      }

    }

    // ------------------------------------------------------------------------------------------

    if (this.probeForm.value.policyChoice === 'new'){
      
      this.createPolicy((err, resp) => {

        if(resp){

          let policyId  = resp['_id'];

          data.notificationPolicyId = policyId;

          this.createOrUpdateProbe(data,(err, resp)=>{

            let probeId = resp['_id'];

            if(resp){
              this.router.navigate(['/notf-policies-edit/' + policyId],  { queryParams: { ref: probeId } } );
            }
    
            if(err){
              this.errorMsg = err.error.message;
            }
  
          })
        }

        if(err){
          this.errorMsg = err.error.message;
        }

      })
      return;

    } else {

        this.createOrUpdateProbe(data, (err, resp)=>{

          if(resp){
            this.router.navigate(['/probes']);
          }
  
          if(err){
            this.errorMsg = err.error.message;
          }

      })
    }

  

  }

  public canAdd = true;

  ngOnInit(){

    this.probeService.getCurrentUser().subscribe(response=>{
      this.userInfo = response;

      if(!this.userInfo.isActive){
        
        this.canAdd = false;
        this.messageBoxData = {

          title:'No active subscription.',
          message:'Your subscription or trial period ended.',
          icon:'fa-exclamation',
          buttons:{
            primary:{ label:'Go Subscriptions'},
            cancel:{ label:'Go Back'} 
          }
      
        }
      } else if(this.userInfo.subscription.usage.probesCount >= this.userInfo.subscription.usage.maxAllowedProbesCount){
        
        this.canAdd = false;
        this.messageBoxData = {

          title:'You have reached the limit for adding new probes.',
          message:'In order to continue adding probes you must upgrade your subscription.',
          icon:'fa-exclamation',
          buttons:{
            primary:{ label:'Go Subscriptions'},
            cancel:{ label:'Go Back'} 
          }
      
        }

      }

    });
    
    this.probeService.listNotifyPolicies().subscribe((data:NotificationPolicy[]) => {

      this.policies = data;
      
      this.probeService.listLocations().subscribe(response=>{

        this.locationsList = response;

        const formLocations = this.probeForm.get('locations') as FormGroup;

        this.probeId = this.route.snapshot.paramMap.get('id'); 

        this.locationsList.forEach((location)=>{
          let value = (!this.probeId && location.isDefault) ? true : false;
          formLocations.addControl(location.locationCode,this.fb.control(value));
        });

        if(this.policies.length === 0){
          this.probeForm.controls.policyChoice.patchValue('new');
        } else {
          this.probeForm.controls.notificationPolicyId.setValue(this.policies[0]._id);
        }

        if (this.probeId){
        
          this.probeService.describeProbe(this.probeId).subscribe((data:Probe)=>{
      
            const locationsSelection = data.locations.reduce((o, key) => ({ ...o, [key]:true}), {});
            formLocations.patchValue(locationsSelection);
            
            for (let i = 0; i < data.matchPolicy.keywords.length -1; i++){
              this.addKeyword();
            }
    
            for (let i = 0; i < data.headers.length -1; i++){
              this.addHeader();
            }
            
            if(!data.notificationPolicyId){
              data.policyChoice = 'none';
              //data.notificationPolicyId = this.policies[0]._id;
            }

            if(!data.notify){
              data.policyChoice = 'none';
            } 

            this.probeForm.patchValue(data);
    
          }, error => {
            this.errorMsg = error.error.message;
          })
        
        }
    
      }, error => {
        this.errorMsg = error.error.message;
      });


      }, error => {
        this.errorMsg = error.error.message;
      });

   

  }

  get getSelectedPolicy(){
    return this.policies.find((elem)=>{
      return elem._id === this.probeForm.value.notificationPolicyId;
    })
  }
  
  pasteUrl(e){

    let content:string  = e.clipboardData.getData('text/plain');
    let re = /^((?:http|https):\/\/)/;
    let matches  = content.match(re);

    if(matches){
      content = content.replace(matches[0],'');
      
      
      setTimeout(() => {
        this.probeForm.controls.probeURL.setValue(content);
        this.probeForm.controls.probePrefix.setValue((matches[0]));
      }, 0);

    } 
  }

}
