import { Component, OnInit, ViewChild } from '@angular/core';
import { ProbeService } from './probe-service';
import { Probe } from './probe';
import { ActivatedRoute } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';


@Pipe({
  name: 'reverse'
})

@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.css']
})
export class ProbeComponent implements OnInit {
  @ViewChild("baseChart") chart: BaseChartDirective;

  public probe:any = {};

  constructor(private probeService:ProbeService, private router: ActivatedRoute) {

    this.probeService.describeProbe(this.probe_id).subscribe(response=>{
      this.probe = response;
  }, error => {
      console.log(error)
    })

  }

  public btnTimeRangeClasses = {
    "btn btn-primary btn-sm": true
  }

  // lineChart
  public lineChartData:Array<any>= [{},{}];
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

  public timeRange:Number = 60;
  public locName:String = '';

  public setTimeRange(timeRange:Number){

    if (timeRange >= 3*24*60){
      this.lineChartOptions.scales.xAxes[0].time.unit = "day";
    } else if (timeRange >= 24*60) {
      this.lineChartOptions.scales.xAxes[0].time.unit = "hour";
    } else {
      this.lineChartOptions.scales.xAxes[0].time.unit = "minute";
    }

    this.timeRange = timeRange;
    this.reloadIsRequired = true;
    this.restartSubscription();
    
  }

  public setLocation(location:String){
    this.locName = location;
    this.reloadIsRequired = true;
    this.restartSubscription();

  }

  probe_id = this.router.snapshot.paramMap.get('id');
  
  public probeResults:Array<Object>;

  public handleResponseForOverview(response:any){

    this.lineChartOptions.scales.yAxes = [{
      stacked:false
    }]

    let chartData = {};
    
    let responseProps = Object.keys(response); // Making an array from fetched JSON.
    let responseArray:any[] = []; // intermediate variable for keeping array

    for (let i of responseProps) { 
      
      responseArray.push(response[i]);

      if (!chartData.hasOwnProperty(response[i]['locName'])){
        chartData[response[i]['locName']] = [];
      } else {
        chartData[response[i]['locName']].push({ t:response[i]['probeTime'], y:response[i]['responseTime']});
      }
    
    }
    
    this.probeResults = responseArray.reverse();
    this.lineChartData.length = 0;
    this.probe.locations.forEach((location: any) => {
      this.lineChartData.push({data: chartData[location], label:location })
    });

    this.reloadChart();

    
  }
  private reloadIsRequired=true;
  private reloadChart() {
    if (this.chart !== undefined && this.reloadIsRequired) {
       this.chart.chart.destroy();
       this.chart.chart = 0;

       this.chart.datasets = this.lineChartData;
       this.chart.labels = this.lineChartLabels;
       this.chart.ngOnInit();

       this.reloadIsRequired=false;
    }
}

  public handleResponse(response:any){

    this.lineChartOptions.scales.yAxes = [{
      stacked:true
    }]

    let chartData = {dns:[],wait:[],tcp:[],firstByte:[],download:[]};
    
    let responseProps = Object.keys(response); // Making an array from fetched JSON.
    let responseArray:any[] = []; // intermediate variable for keeping array

    for (let i of responseProps) { 
      
      responseArray.push(response[i]);

      if(typeof response[i]['timingPhases'] !== 'undefined'){
        chartData.dns.push({ t:response[i]['probeTime'], y:response[i]['timingPhases']['dns']});
        chartData.wait.push({ t:response[i]['probeTime'], y:response[i]['timingPhases']['wait']});
        chartData.tcp.push({ t:response[i]['probeTime'], y:response[i]['timingPhases']['tcp']});
        chartData.firstByte.push({ t:response[i]['probeTime'], y:response[i]['timingPhases']['firstByte']});
        chartData.download.push({ t:response[i]['probeTime'], y:response[i]['timingPhases']['download']});
      }   
    }
    
    this.probeResults = responseArray.reverse();

    this.lineChartData = [
     { data: chartData.dns, label:"DNS" },
     { data: chartData.wait, label:"Wait" },
     { data: chartData.tcp, label:"TCP" },
     { data: chartData.firstByte, label:"First Byte" },
     { data: chartData.download, label:"Download" }
    ];
    console.log(this.lineChartData);

    this.reloadChart();

   
  }

  private subscription;

  private initSubscription(){

    let func = this.locName ? this.handleResponse : this.handleResponseForOverview;

    this.subscription = this.probeService.getProbeResults(this.probe_id, this.timeRange, this.locName).subscribe(
      func.bind(this), error => {
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
  }
}

