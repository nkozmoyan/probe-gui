import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-channels-dialog',
  templateUrl: './channels-dialog.component.html',
  styleUrls: ['./channels-dialog.component.scss']
})
export class ChannelsDialogComponent implements OnInit {
  @Input() channel_ids: string;

  constructor(private probeService:ProbeService) { }

  channels:any;

  ngOnInit() {
    
    this.probeService.listNotifyChannels().subscribe(response=>{
        
      this.channels = response;

      this.channels = Object.keys(this.channels).filter(key=>this.channel_ids.includes(this.channels[key]['_id'])).map(v=>this.channels[v]);

    }, error => {
        console.log(error)
    })
  }

}
