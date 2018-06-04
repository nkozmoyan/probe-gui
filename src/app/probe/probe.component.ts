import { Component, OnInit } from '@angular/core';
import { ProbeService } from './probe-service';
import { Probe } from './probe';
import { ActivatedRoute } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.css']
})
export class ProbeComponent implements OnInit {

  constructor(private probeService:ProbeService, private router: ActivatedRoute) { }
  
  // lineChart
  public lineChartData:Array<any> = [{}];
  //public lineChartLabels:Array<any> = [{}];
  public lineChartOptions:any = { 
    responsive: true,
    
    scales: {
      xAxes: [{
          type: 'time',
          time:{
            displayFormats: {
              minute: 'h:mm a'
            }
          }
      }]
    }
  
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }


  probe_id = this.router.snapshot.paramMap.get('id');

  public probeResults:Array<Object>;

  ngOnInit() {
         
    this.probeService.getProbeResults(this.probe_id).subscribe(response=>{
      
      let responseProps = Object.keys(response);
      
      let respArr = [];
      let chartArr = [];

      for (let prop of responseProps) { 
        respArr.push(response[prop]);
        chartArr.push({t:response[prop]['probeTime'], y:response[prop]['responseTime']})
      }
      
      this.probeResults = respArr.reverse();

      this.lineChartData = chartArr;

    }, error => {
        console.log(error)
      })
    };
}

