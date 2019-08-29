import { Component, OnInit, Input } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';

@Component({
  selector: 'app-channels-popover',
  templateUrl: './channels-popover.component.html',
  styleUrls: ['./channels-popover.component.scss']
})
export class ChannelsPopoverComponent implements OnInit {
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
