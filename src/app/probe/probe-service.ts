import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';


export interface Config {
    heroesUrl: string;
    configfile: string;
  }

@Injectable()
export class ProbeService {

    constructor(private http:HttpClient){ }

    timer = timer(0, 60000);

    createProbe(probe:any){
        return this.http.post('http://localhost:3050/api/probes/', probe);
    }
    
   updateProbe(id:any,probe:any){
        return this.http.put('http://localhost:3050/api/probes/'+id, probe);
    }


    listProbes(){
        return this.http.get('http://localhost:3050/api/probes/');
    }

    getProbeResults(id:any){
        return this.timer.pipe(flatMap((i) => this.http.get('http://localhost:3050/api/probes/'+id+'/results')))
    }

    describeProbe(id:any){
        return this.http.get('http://localhost:3050/api/probes/'+id)
    }

    deleteProbe(id:any){
        return this.http.delete('http://localhost:3050/api/probes/'+id);
    }

}
