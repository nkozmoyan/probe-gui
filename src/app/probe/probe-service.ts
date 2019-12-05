import { Injectable } from '@angular/core';
import { HttpClient,HttpParams, HttpResponse } from '@angular/common/http';
import { timer, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { NotificationPolicy, Event } from '../interface/interface';
import { TimeRange } from '../interface/interface';


import { Probe } from './probe';

@Injectable()
export class ProbeService {

    constructor(private http:HttpClient){ 
        
    }
    
    private apiUrl = environment.apiUrl
    private timer = timer(0, 30*1000);

    createProbe(probe:any){
        return this.http.post(this.apiUrl+'/probes/', probe);
    }
    
    updateProbe(id:any,probe:any){
        return this.http.put(this.apiUrl + '/probes/'+id, probe);
    }


    listProbes(){
        return this.http.get(this.apiUrl + '/probes/');
    }

    listLocations(){
        return this.http.get(this.apiUrl + '/locations/');
    }

    getProbeResults(id:any, timeRange:TimeRange, locName:string): Observable<HttpResponse<any>>{

        if(timeRange.type === 'absolute'){

            let params = new HttpParams()
                .set('location', locName)
                .set('startDate', timeRange.absoluteRange[0].toISOString())
                .set('endDate', timeRange.absoluteRange[1].toISOString());
            
            return this.http.get<any>(this.apiUrl + '/probes/'+id+'/results/', {params, observe: 'response'});

        } else {
        
            let params = new HttpParams()
                .set('location', locName)
                .set('last',timeRange.relativeRange.toString());

            return this.timer.pipe(flatMap((i) => this.http.get<any>(this.apiUrl + '/probes/'+id+'/results/', {params, observe: 'response'})));
        }
    }

    getLastResult(id:Array<String>){
        
        let queryString:String = '';

        queryString = '/?id='+id.join(';');

        return this.timer.pipe(flatMap((i) => this.http.get(this.apiUrl + '/last-result' + queryString)))
    }

    describeProbe(id:any){
        return this.http.get(this.apiUrl + '/probes/'+id);
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

    updateNotifyPolices(obj:any){

        return this.http.post(this.apiUrl + '/notification-policies/notification-channel', obj);
    }

    deleteNotifyPolicy(id:any){
        return this.http.delete(this.apiUrl + '/notification-policies/'+id);
    }

    
    listNotifyPolicies(){
        return this.http.get<NotificationPolicy[]>(this.apiUrl + '/notification-policies/');
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
    
    listNotifyHistory(limit:number, offset:number): Observable<HttpResponse<any>>{

        const params = new HttpParams()
                            .set('limit', limit.toString())
                            .set('offset', offset.toString());

        return this.http.get<any>(this.apiUrl + '/notification-history/', {params,  observe: 'response' });

    }


    listEvents(limit:number, offset:number): Observable<HttpResponse<any>>{

        const params = new HttpParams()
                            .set('limit', limit.toString())
                            .set('offset', offset.toString());

        return this.http.get<any>(this.apiUrl + '/events/', {params,  observe: 'response' });

    }

    resendToken(data):any{
        return this.http.post(this.apiUrl +'/confirmation/resend/', data);

    }
    
    resendVerificationMessage(data):any{
        return this.http.post(this.apiUrl +'/confirmation/channel/resend/', data);

    }

    verifyToken(tokenCode):any{
        return this.http.get(this.apiUrl +'/confirmation/'+ tokenCode);

    }

    checkPasswordResetTokenValidity(token){

        return this.http.head(this.apiUrl + '/password/'+token,{observe: 'response'});
        
    }

    setPassword(token,data){
        return this.http.post(this.apiUrl + '/password/set/'+token, data);

    }

    getCurrentUser():any{
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
