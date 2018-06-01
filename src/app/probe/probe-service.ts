import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Config {
    heroesUrl: string;
    configfile: string;
  }

@Injectable()
export class ProbeService {

    constructor(private http:HttpClient){ }

    createProbe(probe:any){
        return this.http.post('http://localhost:3050/api/probes', probe);
    }

    listProbes(){
        return this.http.get('http://localhost:3050/api/probes');
    }

}
