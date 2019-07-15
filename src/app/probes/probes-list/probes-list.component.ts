import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-probes-list',
  templateUrl: './probes-list.component.html',
  styleUrls: ['./probes-list.component.css']
})
export class ProbesListComponent implements OnInit {

  constructor(private probeService:ProbeService,private modalService: BsModalService) {}

  public  probes;
  private subscription;
  
  modalRef: BsModalRef;
  deleteProbeID: string;

  toggleProbeStatus(probe_id){
    
    this.probeService.updateProbe(probe_id, {active:!this.probesByKeys[probe_id]['active']}).subscribe( response => {
        this.probesByKeys[probe_id] = Object.assign(this.probesByKeys[probe_id], response);
    }, error => {
      console.log("Error on status change:");
      console.log(error)
    })  
  
  }

  openModal(template: TemplateRef<any>, probe_id) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    this.deleteProbeID = probe_id;
  }
 
  confirm(): void {
    this.deleteProbe();
    this.modalRef.hide();
  }
 
  decline(): void {
    this.modalRef.hide();
    this.deleteProbeID = undefined;
  }

  deleteProbe(){
    
    this.probeService.deleteProbe(this.deleteProbeID).subscribe( response => {
        this.getList();
    }, error => {
      console.log("Error on deletion:",error);
    })

  }

  private probesByKeys = [];        // stores probes' data by probeId key
  private locationLabels = [];
  
  updateProbesByKeys(data){
    Object.keys(data).forEach(i => {
      this.probesByKeys[data[i]['probe_id']] = Object.assign(this.probesByKeys[data[i]['probe_id']], data[i]);            
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
          console.log(error)
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
