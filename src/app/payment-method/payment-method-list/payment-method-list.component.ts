import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { ConfirmDialogService } from '../../shared/confirm-dialog/confirm-dailog-service';
import { PaymentService } from '../../util/stripe';
@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrls: ['./payment-method-list.component.scss']
})
export class PaymentMethodListComponent implements OnInit {

  constructor( private probeService:ProbeService, private confirmDialogService: ConfirmDialogService, private paymentService: PaymentService
    ) { }

  paymentMethods = [];
  stripeData:any;
  errorMsg:string = '';

  state: 
  'list' | 
  'new' | 
  'error'  = 'list'; 

  confirmDeletion(id){
    this.confirmDialogService.confirm(resp =>{
      if(resp){
        this.deletePaymentMethod(id);
      }
    })
  }

  deletePaymentMethod(id){
    this.paymentService.deletePaymentMethod(id).subscribe(res=>{
      this.getList();
    }, err=>{
      this.state = 'error';
      this.errorMsg = err.error.err;
    })
  }

  setDefault(id){
    this.paymentService.setDefaultPaymentMethod(id).subscribe(res=>{
      this.getList();
    }, err=>{
      this.state = 'error';
      this.errorMsg = err.error.err;
    })
  }

  paymentMethodSubmited(result){

    if (result.cancel) {
      this.state = 'list';
      return;
    }

    if(result.success){
      this.getList();
      this.state = 'list';
    } else {
      this.state = 'error';
      this.errorMsg = result.err;
    }  

  }

  getList(){

    this.probeService.getCurrentUser().subscribe(response=>{
      
      let userInfo = response;

      if(userInfo.stripe){
        this.stripeData = userInfo.stripe;

        if(userInfo.stripe.paymentMethods && userInfo.stripe.paymentMethods.data)
          this.paymentMethods =  userInfo.stripe.paymentMethods.data;
        }

    })

  }

  ngOnInit() {

    this.getList();

  }

}
