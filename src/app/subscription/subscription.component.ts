import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../util/stripe';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  constructor(private paymentService:PaymentService) { }

  state: 'pre-checkout' | 'checkout' | 'success' | 'error' = 'pre-checkout'; 
  plan:string;

  proceedToCheckout(plan){
    this.plan = plan;
    this.state = 'checkout';
  }


  purchase(event){
   
    if(event.success){
      
      this.paymentService.subscribeToPlan({plan:this.plan}).subscribe(
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
  }

}
