import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PaymentService } from '../util/stripe';

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
    private paymentService:PaymentService
    ) { }

  proceedToCheckout(){
    this.state = 'checkout';
  }

  purchase(event){
   
    if(event.success){
      
      this.paymentService.addSMS({ count:this.packageSelection.value.selection, paymentMethod:event.data.payment_method }).subscribe(
        res=>{
          this.state = 'success';
        }, 
        err=>{
         
          this.state = 'error';
        }
      )
     
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
