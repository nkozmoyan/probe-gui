import { Component, OnInit } from '@angular/core';
import { ProbeService } from './probe-service';
import { Probe } from './probe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.css']
})
export class ProbeComponent implements OnInit {

  constructor(private probeService:ProbeService, private router: ActivatedRoute) { }
  
  // lineChart
  public lineChartData:Array<any> = [
    {data: [], label: 'Location AA'}
  ];
  public lineChartLabels:Array<any>;
  public lineChartOptions:any = { responsive: true };
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


  tid = this.router.snapshot.paramMap.get('id');

  probeResults = {};

  ngOnInit() {
     
    console.log(this.tid);
    
    this.probeService.getProbeResults(this.tid).subscribe(response=>{



        let resultArrayD = Object.keys(response).map(function(index){
          let d = response[index]['probeTime'];
          // do something with person
          return d;
      
        });

        let resultArrayT = Object.keys(response).map(function(index){
          let t = response[index]['responseTime'];
          // do something with person
          return t;
      
        });
        
         this.lineChartData = [
          {data: resultArrayT, label: 'Series A'}
        ];
         this.lineChartLabels = ['A','B']//resultArrayD;
        console.log( this.lineChartLabels);
        this.probeResults = response;
      }, error => {
        console.log(error)
      })
       // In a real app: dispatch action to load the details here.
       console.log( this.probeResults)
    };
}

