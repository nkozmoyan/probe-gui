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

  deleteProbe(probe_id:any){
    
    this.probeService.deleteProbe(probe_id).subscribe( response => {
        this.getList();
    }, error => {
      console.log("Error on deletion:");
      console.log(error)
    })

  }
    
  getList(){
    this.probeService.listProbes().subscribe( response => {
          this.probes = response;
      },error => {
          console.log(error)
      }
    )
  }

  ngOnInit() {
    this.getList();
  }

}
