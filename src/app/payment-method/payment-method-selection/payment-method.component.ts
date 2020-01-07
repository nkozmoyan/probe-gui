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
  @Input() onlyNew: boolean;
  @Output() paymentMethod = new EventEmitter<any>();
  @ViewChild(StripeCardComponent, {static: false}) card: StripeCardComponent;
  

  constructor(
    private probeService:ProbeService,
    private paymentService:PaymentService,
    private fb: FormBuilder,
    private stripeService: StripeService) { }

  
  stripeData:any = {};
  options: 'existing' | 'new';
  paymentMethods:[] = [];

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

  cancel(){
    this.paymentMethod.emit({cancel:true, success:false});
  }

  setupNewPaymentMethod(callbackFn) {

    let setupIntent;
    this.disablePurchaseBtn = true;

    this.paymentService.getCleientSecret().subscribe(result=>{
      
      setupIntent = result;

      // this is a reference to the stripe elements object
      const stripe:any = this.stripeService.getInstance();

      stripe.confirmCardSetup(setupIntent.clientSecret, {

        payment_method: {
          card: this.card.getCard(),
          billing_details: {name: this.newCard.value.name}
        }

      }).then(result => {

        if (result.setupIntent && result.setupIntent.status === "succeeded") {
          // Because this is a new payment method it should be attached to the customer.

          this.paymentService.attachPaymentMethod({paymentMethod: result.setupIntent.payment_method}).subscribe(res=>{
            
            callbackFn(null, result.setupIntent.payment_method);
          },
          error=>{
            callbackFn(error.message);
          });

          
        } else {
          // Error creating the token
          callbackFn(result.error.message);
        }
        
      }).catch(err=>{
        callbackFn(err);
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
    
    if(this.onlyNew){
      this.newCard.controls.options.patchValue('new');
    } else {
      
      this.probeService.getCurrentUser().subscribe(response=>{
        
        let userInfo = response;

        this.stripeData = userInfo.stripe;

        if(this.stripeData && this.stripeData.paymentMethods && this.stripeData.paymentMethods.data){
          
          this.paymentMethods =  this.stripeData.paymentMethods.data;
          this.options = 'existing';

        } else {
          this.options = 'new';
        }

        this.newCard.controls.options.patchValue(this.options);
      
      
      })
    }

  }

}
