import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs/operators/take';
import { NotfChannelsTypes } from '../notf-channels-types';

@Component({
  selector: 'app-notf-channels-list',
  templateUrl: './notf-channels-list.component.html',
  styleUrls: ['./notf-channels-list.component.css']
})

export class NotfChannelsListComponent implements OnInit {

  constructor(private probeService:ProbeService, private modalService: BsModalService, private notfTypes:NotfChannelsTypes) { }

  public channels:{};
  public types = this.notfTypes.types;

  bsModalRef: BsModalRef;

  confirmDeletion(id){

    id  = id || '';

    const initialState = {
      id:id,
      title: 'Value = ' + id,
      message: 'Are you sure that you want to delete this channel?',
    };
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});

    this.bsModalRef.content.action.pipe(take(1))
            .subscribe((value) => {

              if (value) this.deleteNotifyChannel(id);

              this.bsModalRef.hide();

             }, (err) => {
                 return false;
        });
    this.bsModalRef.content.closeBtnName = 'Close';
    
  }


  deleteNotifyChannel(id:any){
    
    this.probeService.deleteNotifyChannel(id).subscribe( response => {
        this.getList();
    }, error => {
      console.log("Error on deletion:");
      console.log(error)
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
