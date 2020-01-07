import { Injectable } from '@angular/core';
import { HttpClient,HttpParams, HttpResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';


@Injectable()
export class PaymentService {

    constructor(private http:HttpClient){}

    private apiUrl = environment.apiUrl;

    getCleientSecret(){
        return  this.http.get(this.apiUrl + '/stripe/client-secret/');
    }

    attachPaymentMethod(params){
        return  this.http.put(this.apiUrl + '/users/me/payment-methods/', params);
    }

    deletePaymentMethod(id){
        return  this.http.delete(this.apiUrl + '/users/me/payment-methods/'+ id );
    }

    setDefaultPaymentMethod(id){
        
        let params  =  {
            defaultPaymentMethod:id
        };
        
        return  this.http.patch(this.apiUrl + '/users/me/', params );
    }

    addSMS(params){
        return  this.http.post(this.apiUrl + '/users/me/sms', params);
    }

    subscribeToPlan(params){
        return  this.http.put(this.apiUrl + '/users/me/plan', params);
    }

    cancelSubscription(){
        return  this.http.delete(this.apiUrl + '/users/me/plan');
    }

    getPrices(){
        return  this.http.get(this.apiUrl + '/plans/');
    }



}