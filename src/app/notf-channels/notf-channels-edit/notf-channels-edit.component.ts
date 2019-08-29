import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProbeService } from '../../probe/probe-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotfChannel, NotfChannelsTypes } from '../notf-channels-types';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';


@Component({
  selector: 'app-notf-channels-edit',
  templateUrl: './notf-channels-edit.component.html',
  styleUrls: ['./notf-channels-edit.component.css']
})
export class NotfChannelsEditComponent implements OnInit {

  
  public id;
  public data:NotfChannel;
  public message = '';
  public types = this.notfTypes.types;

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;

  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.Canada];


  formGroup = this.fb.group({
    name:['',Validators.required],
    type:[this.types[0].typeKey,Validators.required], // 0 is the index for E-mail 

  });

  constructor(private probeService:ProbeService, 
    private notfTypes:NotfChannelsTypes,
    private router: Router,
    private route: ActivatedRoute, 
    private fb: FormBuilder) {}


  addSMSControl(){
    this.formGroup.addControl('sms', this.fb.control('',{updateOn:'change',validators:Validators.required}));
  }


  channelChange(){

    if (this.formGroup.controls.type.value == 'sms'){

      if (this.formGroup.contains('channel'))
        this.formGroup.removeControl('channel');

      this.addSMSControl();

      this.formGroup.controls.sms.reset();

    } else {

      if (this.formGroup.contains('sms'))
        this.formGroup.removeControl('sms');

        this.formGroup.addControl('channel', this.fb.control('', Validators.required));

    }
    
  }

  onSubmit() {

    this.data = {
      name:this.formGroup.controls.name.value,
      type:this.formGroup.controls.type.value,
      channel:''
    }

    if (this.data.type == 'sms'){
      this.data.channel = this.formGroup.controls.sms.value.internationalNumber;
    } else {
      this.data.channel = this.formGroup.controls.channel.value;
    }
    
    let request;

    if (!this.id){
      request = this.probeService.createNotifyChannel(this.data);
    }  else {
      request = this.probeService.updateNotifyChannel(this.id, this.data);
    }

    request.subscribe(response=>{

      this.router.navigate(['/notf-channels-verify/',response._id]);

    }, error => {
      this.message = error.error.msg;

    })
  }

  ngOnInit() {

    this.channelChange();

    if (this.id = this.route.snapshot.paramMap.get('id')){
      
      this.probeService.describeNotifyChannel(this.id).subscribe(response=>{

      if(response['type']=='sms'){
       
        this.addSMSControl(); 
        response['sms']  = response['channel'];
      }
     
      this.formGroup.patchValue(response);
      

    }, error => {
        console.log(error)
      })
    
    }

  }
}
