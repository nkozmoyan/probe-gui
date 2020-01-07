import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../probe/probe-service';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss']
})
export class BillingHistoryComponent implements OnInit {

  constructor(private probeService:ProbeService) { }

  public logRecords = [];
  public locationLabels = [];

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

  }

  getList(limit, offset){

    this.probeService.listBillingHistory(limit, offset).subscribe( response => {
      
      this.logRecords = response.body;
      this.total = response.headers.get('X-Total-Count');
      
      if(this.endVal > this.total){
        this.endVal = this.total
      }
      },error => {
          console.log(error);
      }
    )
  }


  ngOnInit() {
    this.getList(this.limit, this.offset);

  }

}
