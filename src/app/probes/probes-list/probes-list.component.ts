import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { ConfirmDialogService } from '../../shared/confirm-dialog/confirm-dailog-service';

@Component({
  selector: 'app-probes-list',
  templateUrl: './probes-list.component.html',
  styleUrls: ['./probes-list.component.scss']
})
export class ProbesListComponent implements OnInit, OnDestroy {

  constructor(private probeService:ProbeService, private confirmDialogService:ConfirmDialogService) {}

  public  probes;
  public  errorMsg:string = '';
  private subscription;

  toggleProbeStatus(probeId){
    
    this.probeService.updateProbe(probeId, {active:!this.probesByKeys[probeId]['active']}).subscribe( response => {
        this.probesByKeys[probeId] = Object.assign(this.probesByKeys[probeId], response);
    }, error => {
      this.errorMsg = error.error.message;
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
        this.errorMsg = error.error.message;
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
          this.errorMsg = error.error.message;
        })
        
      },error => {
          this.errorMsg = error.error.message;
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
      this.errorMsg = error.error.message;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
