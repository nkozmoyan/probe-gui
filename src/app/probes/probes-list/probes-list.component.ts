import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs/operators/take';

@Component({
  selector: 'app-probes-list',
  templateUrl: './probes-list.component.html',
  styleUrls: ['./probes-list.component.css']
})
export class ProbesListComponent implements OnInit, OnDestroy {

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

  bsModalRef: BsModalRef;

  confirmDeletion(id){

    id  = id || '';

    const initialState = {
      id:id,
      title: 'Value = ' + id,
      message: 'Are you sure that you want to delete this probe?',
    };
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});

    this.bsModalRef.content.action.pipe(take(1))
            .subscribe((value) => {

              if (value) this.deleteProbe(id);

              this.bsModalRef.hide();

             }, (err) => {
                 return false;
        });
    this.bsModalRef.content.closeBtnName = 'Close';
    
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
