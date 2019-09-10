import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { ConfirmDialogService } from '../../shared/confirm-dialog/confirm-dailog-service';
import { NotfChannelsTypes } from '../notf-channels-types';

@Component({
  selector: 'app-notf-channels-list',
  templateUrl: './notf-channels-list.component.html',
  styleUrls: ['./notf-channels-list.component.css']
})

export class NotfChannelsListComponent implements OnInit {

  constructor(private probeService:ProbeService, private confirmDialogService: ConfirmDialogService, private notfTypes:NotfChannelsTypes) { }

  public channels;
  public types = this.notfTypes.types;


  confirmDeletion(id){

    this.confirmDialogService.confirm(resp =>{
      if(resp){
        this.deleteNotifyChannel(id);
      }
    })
    
  }

  deleteNotifyChannel(id:any){
    
    this.probeService.deleteNotifyChannel(id).subscribe( response => {
        this.getList();
    }, error => {
      console.log("Error on deletion:");
      console.log(error);
    })

  }
    
  getList(){
    this.probeService.listNotifyChannels().subscribe( response => {
          
      this.channels = response;

      },error => {
          console.log(error)
      }
    )
  }

  ngOnInit() {
    this.getList();
  }

}
