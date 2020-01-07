import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PaymentService } from '../util/stripe';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-sms-balance',
  templateUrl: './sms-balance.component.html',
  styleUrls: ['./sms-balance.component.scss']
})
export class SmsBalanceComponent implements OnInit {

  state: 'pre-checkout' | 'checkout' | 'success' | 'error' = 'pre-checkout'; 
  packageSelection: FormGroup;
  prices:any ={
    sms:0
  };

  public totalCost:number;

  constructor(
    private fb: FormBuilder,
    private paymentService:PaymentService,
    private auth:AuthService
    ) { }

  proceedToCheckout(){
    this.state = 'checkout';
  }

  back(){
    this.state = 'pre-checkout';
    return;
  }

  errorMsg:string='';

  purchase(event){
   
    if(event.success){

      this.paymentService.addSMS({ count:this.packageSelection.value.selection, paymentMethod:event.paymentMethod }).subscribe(
        res=>{
          
          this.state = 'success';
          this.auth.getCurrentUser();
        }, 
        err=>{
          this.errorMsg = err.error.msg;
          this.state = 'error';
        }
      )
     
    } else if(event.cancel) {
      this.state = 'pre-checkout';
    } else {
      this.state = 'error';
    }
    
  }

  ngOnInit() {
    
    this.packageSelection = this.fb.group({
      selection: ['50']
    });

    this.paymentService.getPrices().subscribe(res=>{
      this.prices = res;
    })

  }

}
