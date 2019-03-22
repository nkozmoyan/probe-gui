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

  public  probes;
  private subscription1
  private subscription2;

  toggleProbeStatus(probe_id){
    
    this.probeService.updateProbe(probe_id, {active:!this.probesByKeys[probe_id]['active']}).subscribe( response => {
        console.log(response);
        this.probesByKeys[probe_id] = Object.assign(this.probesByKeys[probe_id], response);
    }, error => {
      console.log("Error on deletion:");
      console.log(error)
    })  
  
  }

  deleteProbe(probe_id:any){
    
    this.probeService.deleteProbe(probe_id).subscribe( response => {
        this.getList();
    }, error => {
      console.log("Error on deletion:");
      console.log(error)
    })

  }

  private probesByKeys = [];        // stores probes' data by probeId key

  updateProbesByKeys(data){
    console.log(data);
    Object.keys(data).forEach(i => {
      this.probesByKeys[data[i]['probe_id']] = Object.assign(this.probesByKeys[data[i]['probe_id']], data[i]);            
    });
  }

  getList(){
    this.subscription1 = this.probeService.listProbes().subscribe( response => {
        
        this.probes = response;

        let keys = Object.keys(response);
        let ids:Array<String> = [];

        for (let i of keys){
          ids.push(response[i]['_id']);  
          this.probesByKeys[response[i]['_id']] = response[i];

        }
        console.log(this.probes);
        
        this.subscription2 = this.probeService.getLastResult(ids).subscribe(probe => {

        this.updateProbesByKeys(probe);
        
        console.log(this.probes);

        }, error => {
        })
        
      },error => {
          console.log(error)
      }
    )
  }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy(){
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
