import { Component, OnInit,ViewChild, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { ConfirmDialogService } from '../../shared/confirm-dialog/confirm-dailog-service';
import { ChannelsDialogService } from '../../shared/channels-dialog/channels-dailog-service';

@Component({
  selector: 'app-notf-policies-list',
  templateUrl: './notf-policies-list.component.html',
  styleUrls: ['./notf-policies-list.component.css']
})
export class NotfPoliciesListComponent implements OnInit {
  constructor(private probeService:ProbeService, 
    private resolver: ComponentFactoryResolver, 
    private confirmDialogService: ConfirmDialogService,
    private channelsDialogService: ChannelsDialogService
    ) { }


  confirmDeletion(id){

    this.confirmDialogService.confirm(resp =>{
      if(resp){
        this.deleteNotifyPolicy(id);
      }
    })

  }


  public policies;

  deleteNotifyPolicy(id:any){
    
    this.probeService.deleteNotifyPolicy(id).subscribe( response => {
        this.getList();
    }, error => {
      console.log("Error on deletion:");
      console.log(error)
    })

  }
    
  getList(){
    this.probeService.listNotifyPolicies().subscribe( response => {
          this.policies = response;
      },error => {
          console.log(error)
      }
    )
  }


  ngOnInit() {
    this.getList();
  }

}
