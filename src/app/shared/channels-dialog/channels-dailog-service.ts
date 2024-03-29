import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ChannelsDialogComponent } from '../../shared/channels-dialog/channels-dialog.component';

@Injectable()
export class ChannelsDialogService {
    
    constructor(private modalService: BsModalService){
    }

    bsModalRef: BsModalRef;

    public showChannels(channelIds){
  
      channelIds  = channelIds || [];
  
      const initialState = {
        channelIds:channelIds
      };
      this.bsModalRef = this.modalService.show(ChannelsDialogComponent, {initialState});
  
      /*
      this.bsModalRef.content.action.pipe(take(1))
              .subscribe((value) => {
                this.bsModalRef.hide();
               }, (err) => {
                   return false;
          });
      this.bsModalRef.content.closeBtnName = 'Close';
      
      */
  
    }
}
