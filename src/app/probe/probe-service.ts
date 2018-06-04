import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Config {
    heroesUrl: string;
    configfile: string;
  }

@Injectable()
export class ProbeService {

    constructor(private http:HttpClient){ }

    timer = Observable.timer(0, 1000);


    createProbe(probe:any){
        return this.http.post('http://localhost:3050/api/probes/', probe);
    }

    listProbes(){
        return this.http.get('http://localhost:3050/api/probes/');
    }

    getProbeResults(id:any){
        return this.timer
      .flatMap((i) => this.http.get('http://localhost:3050/api/probes/'+id))
    }

    deleteProbe(id:any){
        return this.http.delete('http://localhost:3050/api/probes/'+id);
    }

}
