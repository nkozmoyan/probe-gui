import { Component,EventEmitter, Input, OnInit, ViewChild, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProbeService } from '../../probe/probe-service';

import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";
import { PaymentService } from '../../util/stripe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {
  @Output() paymentMethod = new EventEmitter<any>();
  @ViewChild(StripeCardComponent, {static: false}) card: StripeCardComponent;
  

  constructor(
    private probeService:ProbeService,
    private paymentService:PaymentService,
    private stripeSerivce: StripeService,
    private fb: FormBuilder,
    private stripeService: StripeService) { }


  stripeData:any = {};
  options: 'existing' | 'new';
  
  disablePurchaseBtn:boolean = false;

  cardOptions: ElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#0C53A6',
        color: '#31325F',
        fontWeight: 400,
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': { color: '#CFD7E0' }
      }
    }
  };
 
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
 
  newCard: FormGroup;

  continue(){
    if(this.newCard.value.options === 'new'){
      this.setupNewPaymentMethod((err, result)=>{
        if(err){
          this.paymentMethod.emit({success:false, err:err});
        } else {
          this.paymentMethod.emit({success:true, paymentMethod:result});
        }
        
      });
    } else {
      this.paymentMethod.emit({success:true, paymentMethod:this.newCard.value.options});
    }
  }

  setupNewPaymentMethod(callbackFn) {

    let setupIntent;
    this.disablePurchaseBtn = true;

    this.paymentService.getCleientSecret('sms').subscribe(result=>{
      
      setupIntent = result;

      // this is a reference to the stripe elements object
      const stripe:any = this.stripeService.getInstance();

      stripe.confirmCardSetup(setupIntent.clientSecret, {

        payment_method: {
          card: this.card.getCard(),
          billing_details: {name: this.newCard.value.name}
        }

      }).then(result => {
        console.log(result);
        if (result.setupIntent.status === "succeeded") {
          callbackFn(null, result.setupIntent.payment_method);
        } else {
          // Error creating the token
          callbackFn(result.setupIntent.error.message);
        }
        
      });

    }, err =>{
      callbackFn(err);
    })

  }

  ngOnInit() {

    this.newCard = this.fb.group({
      name: ['', [Validators.required]],
      options: ['']
    });

    this.probeService.getCurrentUser().subscribe(response=>{
      
      let userInfo = response;

      if(userInfo.stripe){
        
        this.stripeData = userInfo.stripe;

        let selected = this.stripeData.customerId ? 'existing' : 'new';
        this.newCard.controls.options.patchValue(selected);
        

      }

    });

  }

}
