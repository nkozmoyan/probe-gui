import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProbeService } from '../../probe/probe-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotfChannel,NotfChannelsTypes } from '../notf-channels-types';

@Component({
  selector: 'app-notf-channels-verify',
  templateUrl: './notf-channels-verify.component.html',
  styleUrls: ['./notf-channels-verify.component.scss']
})
export class NotfChannelsVerifyComponent implements OnInit {

  public codeError:string = '';
  public dibsableButton:boolean = false;
  public message = '';
  public types = this.notfTypes.types;
  public data = {};

  private id;

  constructor(
    private probeService:ProbeService, 
    private notfTypes:NotfChannelsTypes,
    private router: Router,
    private route: ActivatedRoute, 
    private fb: FormBuilder) { }

  formVerification = this.fb.group({
    code:['',Validators.pattern('[0-9]{6}')]
  });

  resendVerification(){

    this.dibsableButton = true;

    setTimeout(()=>{
      this.dibsableButton = false;
    },5000)
    
    if(!this.id){
      this.message = 'Nothing to verify.';
      return false;
    }

    this.probeService.resendVerificationMessage({channelId:this.id}).subscribe(resp => {
      if(resp['success']){
        this.message = resp['msg'];
      } 
  
    }, err => {
      this.message = err.error.msg;
    });
  }

  resetCodeError(){
    this.codeError ='';
  }

  onVerify(){
    
    if (this.data['type'] !='sms'){
      this.router.navigate(['/notf-channels']);
      return;
    } 
    
    
    if(!this.formVerification.controls.code.value){
      this.codeError = 'Verification code is required.';
      return;
    }

    this.probeService.verifyToken(this.formVerification.controls.code.value).subscribe(resp=>{
      this.router.navigate(['/notf-channels']);
      return;
    }, err=>{
      this.codeError = err.error.msg;

    })
  }

  ngOnInit() {

    if (this.id = this.route.snapshot.paramMap.get('id')){
      this.probeService.describeNotifyChannel(this.id).subscribe(response=>{
        
        this.data = response;

        if (this.data['isVerified'] === true)
          this.router.navigate(['/notf-channels']);

        this.data['msg'] = this.notfTypes.getPropertyByKey(this.data['type']).msg;
        this.data['msgInstruction'] = this.notfTypes.getPropertyByKey(this.data['type']).msgInstruction;

        }, error => { console.log(error) })
    
    }

  }

}
