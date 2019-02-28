import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Config {
    heroesUrl: string;
    configfile: string;
  }

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
}
