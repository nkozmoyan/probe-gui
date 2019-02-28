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
  public lineChartData:Array<any> = [{},{},{},{},{}];
  public lineChartLabels:Array<any>;
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
      }],

      yAxes: [{
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Value'
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
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: '#3e95cd',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
    ,
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: '#8e5ea2',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
    ,
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: '#3cba9f',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
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

  private timeRange:Number = 60;
  private locName:String;

  public setTimeRange(timeRange:Number){
    this.timeRange = timeRange;
    this.restartSubscription();
  }

  public setLocation(location:String){
    this.locName = location;
    this.restartSubscription();
  }
  probe_id = this.router.snapshot.paramMap.get('id');
  
  public probeResults:Array<Object>;
  public handleResponse(response:any){
    
    let responseProps = Object.keys(response);
    let chartData = {dns:[],wait:[],tcp:[],firstByte:[],download:[]};

    let respArr = [];

    for (let prop of responseProps) { 
      
      respArr.push(response[prop]);

      if(typeof response[prop]['timingPhases'] !== 'undefined'){
        chartData.dns.push({ t:response[prop]['probeTime'], y:response[prop]['timingPhases']['dns']});
        chartData.wait.push({ t:response[prop]['probeTime'], y:response[prop]['timingPhases']['wait']});
        chartData.tcp.push({ t:response[prop]['probeTime'], y:response[prop]['timingPhases']['tcp']});
        chartData.firstByte.push({ t:response[prop]['probeTime'], y:response[prop]['timingPhases']['firstByte']});
        chartData.download.push({ t:response[prop]['probeTime'], y:response[prop]['timingPhases']['download']});
      }   
    }
    
    this.probeResults = respArr.reverse();

    this.lineChartData = [
     { data: chartData.dns, label:"DNS" },
     { data: chartData.wait, label:"Wait" },
     { data: chartData.tcp, label:"TCP" },
     { data: chartData.firstByte, label:"First Byte" },
     { data: chartData.download, label:"Download" }
    ];
    console.log( this.lineChartData);
  }

  private subscription;

  private initSubscription(){
    this.subscription = this.probeService.getProbeResults(this.probe_id, this.timeRange, this.locName).subscribe(
      this.handleResponse.bind(this), error => {
        console.log(error)
      })
  }

  private stopSubscription(){
    this.subscription.unsubscribe();
  }

  private restartSubscription(){
    this.stopSubscription();
    this.initSubscription();
  }
  
  ngOnInit() {
    this.initSubscription();
  }

  ngOnDestroy(){
      this.stopSubscription();
      console.log("hey");
  }
}

