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
  stripeData:any = {};

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

    })
  }

  setDefault(id){
    this.paymentService.setDefaultPaymentMethod(id).subscribe(res=>{
      this.getList();
    }, err=>{

    })
  }

  getList(){

    this.probeService.getCurrentUser().subscribe(response=>{
      
      let userInfo = response;

      if(userInfo.stripe){
        this.stripeData = userInfo.stripe;
      }

    })

  }

  ngOnInit() {

    this.getList();

  }

}
