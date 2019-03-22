import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../probe/probe-service';

@Component({
  selector: 'app-notf-history',
  templateUrl: './notf-history.component.html',
  styleUrls: ['./notf-history.component.css']
})
export class NotfHistoryComponent implements OnInit {

  constructor(private probeService:ProbeService) { }
  public logRecords:{};

  private limit =50;
  private offset=0;
  private currentPage = 0;
  private total = null;

  private startVal=1;
  private endVal = this.limit;

  public slide(direction){
    this.currentPage = this.currentPage + direction;
    this.offset = this.currentPage * this.limit;

    this.endVal = this.offset + this.limit;

    if(this.endVal > this.total){
      this.endVal = this.total
    }
    
    this.startVal = this.offset + 1;

    this.getList(this.limit, this.offset);

  }

  getList(limit, offset){
    this.probeService.listNotifyHistory(limit, offset).subscribe( response => {
          
      this.logRecords = response.body;
      this.total = response.headers.get('X-Total-Count')

      },error => {
          console.log(error);
      }
    )
  }
  ngOnInit() {
    this.getList(this.limit, this.offset);
  }

}
