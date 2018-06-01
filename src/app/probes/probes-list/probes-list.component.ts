import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';

@Component({
  selector: 'app-probes-list',
  templateUrl: './probes-list.component.html',
  styleUrls: ['./probes-list.component.css']
})
export class ProbesListComponent implements OnInit {

  constructor(private probeService:ProbeService) { 
      
  }

 probes:{};
  
 ngOnInit() {

      this.probeService.listProbes().subscribe(response=>{
        console.log(response)

        this.probes = response;

      }, error => {
        console.log(error)
      })

  }

}
