import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { ConfirmDialogService } from '../../shared/confirm-dialog/confirm-dailog-service';

@Component({
  selector: 'app-probes-list',
  templateUrl: './probes-list.component.html',
  styleUrls: ['./probes-list.component.css']
})
export class ProbesListComponent implements OnInit, OnDestroy {

  constructor(private probeService:ProbeService, private confirmDialogService:ConfirmDialogService) {}

  public  probes;
  private subscription;

  toggleProbeStatus(probeId){
    
    this.probeService.updateProbe(probeId, {active:!this.probesByKeys[probeId]['active']}).subscribe( response => {
        this.probesByKeys[probeId] = Object.assign(this.probesByKeys[probeId], response);
    }, error => {
      console.log("Error on status change:");
      console.log(error)
    })  
  
  }

  confirmDeletion(id){

    this.confirmDialogService.confirm(resp =>{
      if(resp){
        this.deleteProbe(id);
      }
    })
    
  }

  deleteProbe(id:any){
    
    this.probeService.deleteProbe(id).subscribe( response => {
        this.getList();
    }, error => {
      console.log("Error on deletion:",error);
    })

  }

  private probesByKeys = [];        // stores probes' data by probeId key
  private locationLabels = [];
  
  updateProbesByKeys(data){
    Object.keys(data).forEach(i => {
      this.probesByKeys[data[i]['probeId']] = Object.assign(this.probesByKeys[data[i]['probeId']], data[i]);            
    });
  }

  getList(){
    this.probeService.listProbes().subscribe( response => {
        
        this.probes = response;

        let keys = Object.keys(response);
        let ids:Array<String> = [];

        for (let i of keys){
          ids.push(response[i]['_id']);  
          this.probesByKeys[response[i]['_id']] = response[i];

        }

        this.subscription = this.probeService.getLastResult(ids).subscribe(probe => {

        this.updateProbesByKeys(probe);
        
        }, error => {
        })
        
      },error => {
          console.log(error);
      }
    )
  }

  ngOnInit() {
    this.getList();

    this.probeService.listLocations().subscribe(response=>{

      let locationLabels:any = response;
      locationLabels.forEach((location)=>{
        this.locationLabels[location.locationCode] = location.label;
      });
    }, error => {
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
