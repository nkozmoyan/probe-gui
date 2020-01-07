import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../util/stripe';
import { MessageBox } from './../interface/interface';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  constructor(public auth: AuthService, private paymentService:PaymentService) { }

  state: 
    'pre-checkout' | 
    'switch-subscription' | 
    'switch-subscription-exceeded' |
    'cancel-subscription' |
    'checkout' |
    'success' |
    'error' | 
    'success-canceled' = 'pre-checkout'; 
  
  destinationPlanId:string;
  prices:any;
  currentPlanId;
  errorMsg:string = '';

  messageBoxCanceled:MessageBox = {
    
    title:'Your subscription has been canceled.',
    message: 'We are sorry to see you go. Your subscription has succesfully canceled and you will no longer be charged a monthly fee.',
    icon: 'fa-check-circle',
    buttons:{
      primary:{ label:'Go Back' }
    }

  }

  messageBoxOrderConfirmed:MessageBox = {
    
    title:'Thank you for subscribing!',
    message: 'Your Subscription has been confirmed!',
    icon: 'fa-check-circle',
    buttons:{
      primary:{ label:'Go Back' }
    }

  }

  proceedToCheckout(destinationPlanId){
    
    this.destinationPlanId = destinationPlanId;

    if(this.currentPlanId){

      if(this.getPlanById(this.destinationPlanId).maxProbes < this.getPlanById(this.currentPlanId).usage.probesCount){
        this.state = 'switch-subscription-exceeded';
      } else {
        this.state = 'switch-subscription';
      }
     
    } else {
      this.state = 'checkout';
    }
       
  }

  switchSubscription(){

    this.paymentService.subscribeToPlan({
      plan:this.destinationPlanId,
    }).subscribe(
      res=>{
        this.state = 'success';
        this.render();
      }, 
      err=>{
        this.errorMsg = err.error.err;
        this.state = 'error';
      }
    )
  }

  cancelSubscription(){

    this.paymentService.cancelSubscription().subscribe(
      res=>{

        this.state = 'success-canceled';
        this.render();
      }, 
      err=>{
        this.errorMsg = err.error.err;
        this.state = 'error';
      }
    )
  }

  cancelSubscriptionConfirmation(){
    this.state = 'cancel-subscription';
    this.render();
    return;
  }

  back(){
    this.state = 'pre-checkout';
    return;
  }

  getPlanById(planId){
    return this.prices.plans.find(value=>{
      return value.id === planId;
    })
  }

  purchase(event){

    if(event.cancel){
      this.state = 'pre-checkout';
      return;
    }
   
    if(event.success){
      
      this.paymentService.subscribeToPlan({
        plan:this.destinationPlanId,
        defaultPaymentMethod:event.paymentMethod
      }).subscribe(
        res=>{
          this.state = 'success';
          this.render();
        }, 
        err=>{
    
          this.errorMsg = err.error.err;
          this.state = 'error';
        }
      )
     
    } else {
      this.errorMsg = event.err;
      this.state = 'error';
    }
    
  }

  render(){

    this.auth.getCurrentUser();

    this.paymentService.getPrices().subscribe(res=>{
      this.prices = res;

      let currentPlan = this.prices.plans.find(plan=>{
        return plan.current;
      });

      if(currentPlan){
        this.currentPlanId = currentPlan.id;
      } else {
        this.currentPlanId = null;
      }
        

    })

  }

  ngOnInit() {
    this.render();
  }

}
