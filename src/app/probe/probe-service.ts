import { Injectable } from '@angular/core';
import { HttpClient,HttpParams, HttpResponse } from '@angular/common/http';
import { timer, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
  
@Injectable()
export class ProbeService {

    constructor(private http:HttpClient){ 
        
    }
    
    private apiUrl = environment.apiUrl
    private timer = timer(0, 10000);

    createProbe(probe:any){
        return this.http.post(this.apiUrl+'/probes/', probe);
    }
    
   updateProbe(id:any,probe:any){
        return this.http.put(this.apiUrl + '/probes/'+id, probe);
    }


    listProbes(){
        return this.http.get(this.apiUrl + '/probes/');
    }

    getProbeResults(id:any, timeRange:Number, locName:String){
        
        let queryString:String = '';

        if (locName){
            queryString = '/?location='+locName;
        }

        return this.timer.pipe(flatMap((i) => this.http.get(this.apiUrl + '/probes/'+id+'/results/'+ timeRange + queryString)))
    }

    getLastResult(id:Array<String>){
        
        let queryString:String = '';

        queryString = '/?id='+id.join(';');

        return this.timer.pipe(flatMap((i) => this.http.get(this.apiUrl + '/last-result' + queryString)))
    }

    describeProbe(id:any){
        return this.http.get(this.apiUrl + '/probes/'+id)
    }

    deleteProbe(id:any){
        return this.http.delete(this.apiUrl + '/probes/'+id);
    }

     // *************************************

    createNotifyPolicy(probe:any){
        return this.http.post(this.apiUrl + '/notification-policies/', probe);
    }

    describeNotifyPolicy(id:any){
        return this.http.get(this.apiUrl + '/notification-policies/'+id)
    }
    
    updateNotifyPolicy(id:any,probe:any){
        return this.http.put(this.apiUrl + '/notification-policies/'+id, probe);
    }

    deleteNotifyPolicy(id:any){
        return this.http.delete(this.apiUrl + '/notification-policies/'+id);
    }

    
    listNotifyPolicies(){
        return this.http.get(this.apiUrl + '/notification-policies/');
    }    

    // *************************************

    createNotifyChannel(probe:any){
        return this.http.post(this.apiUrl + '/notification-channels/', probe);
    }

    describeNotifyChannel(id:any){
        return this.http.get(this.apiUrl + '/notification-channels/'+id)
    }
    
    updateNotifyChannel(id:any,probe:any){
        return this.http.put(this.apiUrl + '/notification-channels/'+id, probe);
    }

    deleteNotifyChannel(id:any){
        return this.http.delete(this.apiUrl + '/notification-channels/'+id);
    }

    
    listNotifyChannels(){
        return this.http.get(this.apiUrl + '/notification-channels/');
    }
    
    listNotifyHistory(limit:Number, offset:Number): Observable<HttpResponse<any>>{

        const params = new HttpParams()
                            .set('limit', limit.toString())
                            .set('offset', offset.toString());

        return this.http.get<any>(this.apiUrl + '/notification-history/', {params,  observe: 'response' });

    }

    resendToken(data):any{
        return this.http.post(this.apiUrl +'/confirmation/resend/', data);

    }
    
    resendConfirmation(data):any{
        return this.http.post(this.apiUrl +'/confirmation/channel/resend/', data);

    }

    confirmToken(tokenCode):any{
        return this.http.get(this.apiUrl +'/confirmation/'+ tokenCode);

    }

    checkPasswordResetTokenValidity(token){

        return this.http.head(this.apiUrl + '/password/'+token,{observe: 'response'});
        
    }

    setPassword(token,data){
        return this.http.post(this.apiUrl + '/password/set/'+token, data);

    }

    getCurrentUser(){
        return this.http.get(this.apiUrl + '/users/me');
    }

    updateUserData(data){
        return this.http.put(this.apiUrl + '/users/me', data);

    }

    changePassword(data):any{
        return this.http.put(this.apiUrl + '/users/me/password', data);

    }

    deleteUser():any{
        return this.http.delete(this.apiUrl + '/users/me');
    }
}
