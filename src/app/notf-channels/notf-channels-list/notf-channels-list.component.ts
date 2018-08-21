import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';

@Component({
  selector: 'app-notf-channels-list',
  templateUrl: './notf-channels-list.component.html',
  styleUrls: ['./notf-channels-list.component.css']
})

export class NotfChannelsListComponent implements OnInit {

  constructor(private probeService:ProbeService) { }

  public channels:{};

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
          console.log(this.channels);

      },error => {
          console.log(error)
      }
    )
  }

  ngOnInit() {
    this.getList();
  }

}
