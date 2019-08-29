import { Component, OnInit, ViewChild, Pipe, TemplateRef, OnDestroy } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ProbeService } from './probe-service';
import { ActivatedRoute,Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from './../shared/confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs/operators/take';

@Pipe({
  name: 'reverse'
})

@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.css']
})
export class ProbeComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective, { static: true }) private chart: BaseChartDirective;

  public probe:any = {
    locations:[]
  };

  constructor(private probeService:ProbeService, private router: Router,private route: ActivatedRoute, private modalService: BsModalService) {}

  bsModalRef: BsModalRef;

  confirmDeletion(id){

    id  = id || '';

    const initialState = {
      id:id,
      title: 'Value = ' + id,
      message: 'Are you sure that you want to delete this probe?',
    };
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});

    this.bsModalRef.content.action.pipe(take(1))
            .subscribe((value) => {

              if (value) this.deleteProbe(id);

              this.bsModalRef.hide();

             }, (err) => {
                 return false;
        });
    this.bsModalRef.content.closeBtnName = 'Close';
    
  }

  deleteProbe(id:any){
    
    this.probeService.deleteProbe(id).subscribe( response => {
      this.router.navigate(['/probes']);
    }, error => {
      console.log("Error on deletion:",error);
    })

  }


  toggleProbeStatus(probe_id,setStatus){

    this.probe['active'] = setStatus;

    if (setStatus){
      this.stopSubscription();
    } else {
      this.restartSubscription();
    }
    
    this.probeService.updateProbe(probe_id, {active:setStatus}).subscribe( response => {
      console.log("TBD");
    }, error => {
      console.log("Error on status change:", error);
    })  
  }

  public btnTimeRangeClasses = {
    "btn btn-primary btn-sm": true
  }

  public noData = false;
  // lineChart
  public lineChartData:ChartDataSets[] = [{},{}];
  public lineChartLabels:Label[];
  public lineChartOptions:ChartOptions = { 
    //animation: { duration: 0},
    responsive: true,
    tooltips: {
      position:'nearest',
      intersect:false,
      callbacks: {

          beforeTitle	: function(tooltipItem, data) {
            return '';
          },

          afterTitle : function(tooltipItem, data) {
            return '';
          },
          
          label: function(tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (tooltipItem.datasetIndex === 0) {

              let locName = this.failureMessages[tooltipItem.index].locName || '';
              let error = this.failureMessages[tooltipItem.index].error || '';

              locName = locName ? this.locationLabels[locName] + ': ' : '';
              label = locName + error;

            } else {

              if (label) {
                label += ': ';
              }

              label += Math.round(tooltipItem.yLabel as number) + ' ms';
            }
            return label;
          }.bind(this),

          footer : function(tooltipItem, data) {
            
            if(tooltipItem.length<2){
              return;
            }

            let value:number = 0;
            
            for (let item of tooltipItem){
              value += <number>item.yLabel;
            }

            //if (tooltipItem[0].datasetIndex !== 0) { 
              return 'Total time: ' + Math.round(value) as string + ' ms';
            //}   
            //return '';
          }
      }
  },
    scales: {
      xAxes: [{ 
          type: 'time',
          time:{
            minUnit: 'minute',
            displayFormats: {
              minute: 'h:mm a'
            },
            tooltipFormat:'h:mm a'
          },
          ticks: {
            min:1
          }
      }],

      yAxes: [
        {
        id:'main',
        ticks: {
          beginAtZero:true,
          suggestedMax:100,
          suggestedMin:0
        },
        type: 'linear',
        position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'Response Time (ms)'
        }
       
      }]

    }
  
  };
  public lineChartColors:Color[] = [
    { // Red (Failures)
      backgroundColor: 'rgba(211, 47, 47,0.8)',
      borderColor: 'rgba(211, 47, 47,1)',
    },
    { 
      backgroundColor: 'rgba(47, 92, 154,0.6)',
      borderColor: 'rgba(47, 92, 154,1)',

    },
    { 
      backgroundColor: 'rgba(190, 72, 137,0.6)',
      borderColor: 'rgba(190, 72, 137,1)',
    }
    ,
    { 
      backgroundColor: 'rgba(0, 188, 212,0.6)',
      borderColor: 'rgba(0, 188, 212,1)',

    }
    ,
    { 
      backgroundColor: 'rgba(224, 224, 224,0.6)',
      borderColor: 'rgba(224, 224, 224,1)',
    },
    { 
      backgroundColor: 'rgba(	33, 131, 156,0.6)',
      borderColor: 'rgba(	33, 131, 156,1)',
    }
  ];


  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

 
  // events
  public chartClicked(e:any):void {
    //console.log(e);
  }
 
  public chartHovered(e:any):void {
    //console.log(e);
  }
  public allTimeRanges = [
    {value: 60, label: '1 Hour'},
    {value: 6*60, label: '6 Hours'},
    {value: 24*60, label: '24 Hours'},
    {value: 3*24*60, label: '3 Days'},
    {value: 7*24*60, label: '7 Days'},
    {value: 20*24*60, label: '30 Days'}

  ];
  public timeRange:Number = 60;
  public locName:String = '';

  private reloadIsRequired=true;
  public aggregated:Boolean=false;

  public setTimeRange(timeRange:Number){

    if (timeRange >= 3*24*60){
      this.aggregated = true;
      this.lineChartOptions.scales.xAxes[0].time.unit = "day";
    } else if (timeRange >= 24*60) {
      this.aggregated = true;
      this.lineChartOptions.scales.xAxes[0].time.unit = "hour";
    } else {
      this.aggregated = false;
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

  private stopSubscription(){
    this.subscription.unsubscribe();
  }

  private restartSubscription(){
    this.stopSubscription();
    this.initSubscription();
  }


  probe_id = this.route.snapshot.paramMap.get('id');
  
  public probeResults:Array<Object>;
  private failureMessages;


  private handleResponseForOverview(response:any){


    let chartData = {Failures:[]};
    let datapoint;
    let failureMessages = [];
    let responseProps = Object.keys(response); // Making an array from fetched JSON.
    let responseArray:any[] = []; // intermediate variable for keeping array
    let lastResponse = [];

    this.noData = (responseProps.length === 0) ? true : false;

    for (let i of responseProps) {

      responseArray.push(response[i]);

      let locationLabel  = this.locationLabels[response[i]['locName']];

      if (!chartData.hasOwnProperty(locationLabel)){
        chartData[locationLabel] = [];
      }

      if (response[i]['error']){
        chartData['Failures'].push({ t:response[i]['probeTime'],y:response[i]['responseTime'] || lastResponse[response[i]['locName']]});
        failureMessages.push({ locName:response[i]['locName'], error:response[i]['error'] });
      } else {
        lastResponse[response[i]['locName']] = response[i]['responseTime'];
      }

      datapoint = response[i]['responseTime'] || NaN;
      chartData[locationLabel].push({ t:response[i]['probeTime'], y:datapoint });
    
    }
    
    this.probeResults = responseArray.reverse();
    this.failureMessages = failureMessages;
    this.lineChartData.forEach((x) => {
      if(chartData[x.label]!==undefined)
        x.data = chartData[x.label];
    });

    //console.log( this.lineChartData);

    
  }


  private handleResponse(response:any){


    let timingPhases= {
      failures:{
        data:[],
        label:'Failures'
      },
      dns:{
        data:[],
        label:'DNS'
      },
      wait:{
        data:[],
        label:'Wait'
      },
      tcp:{
        data:[],
        label:'TCP'
      }, 
      firstByte:{
        data:[],
        label:'First Byte'
      }, 
      download:{ 
        data:[],
        label:'Download'
      }
    };

    const getKeyByLabel = (obj,val) => Object.keys(obj).find(key => obj[key]['label'] === val);

    this.probeResults = Object.keys(response).map((i) => { 
      return response[i];
    }).reverse();

    this.noData = (this.probeResults.length === 0) ? true : false;

    let responseKeys = Object.keys(response); // Making an array from fetched JSON.
    let datapoint;
    let failureMessages = [];

    for (let i of responseKeys) { 
      
      for(let key of Object.keys(timingPhases)){

        
        
        if (response[i]['error']){
  
          if(key === 'failures') {
            failureMessages.push({error:response[i]['error']});
            datapoint = 0;
          } else {
            datapoint = response[i]['timingPhases'] ? response[i]['timingPhases'][key] : NaN;
          }
       
          timingPhases[key].data.push({ t:response[i]['probeTime'], y:datapoint})

        }  else  {

          if(key === 'failures'){
            failureMessages.push({error:null});
            datapoint = NaN;
          } else {
            datapoint = response[i]['timingPhases'][key];
          }

          timingPhases[key].data.push({ t:response[i]['probeTime'], y:datapoint})
        }
      }
    }

    this.failureMessages = failureMessages;
    this.lineChartData.forEach((x) => {
      x.data = timingPhases[getKeyByLabel(timingPhases,x.label)].data;
    });

    //console.log(this.lineChartData);

  }

  private subscription ;

  private initSubscription(){

    let func:Function;
    let steppedLine =  this.aggregated ? true : false;
    
    this.lineChartData = [ 
      { data:[], label:'Failures', pointRadius:6, pointHoverRadius:8, pointStyle:'circle', showLine:false, fill:false}
    ];

    if (this.locName){
      this.lineChartOptions.tooltips.mode = 'index';

      this.lineChartOptions.scales.yAxes[0].stacked=true;  

      this.lineChartData.push(
        { data:[], label:"DNS", steppedLine: steppedLine, fill:'origin'},
        { data:[], label:"Wait", steppedLine: steppedLine,fill:'-1'},
        { data:[], label:"TCP", steppedLine: steppedLine,fill:'-1'},
        { data:[], label:"First Byte", steppedLine: steppedLine, fill:'-1'},
        { data:[], label:"Download" , steppedLine: steppedLine, fill:'-1'}
      );

      func = this.handleResponse;

    } else {
      this.lineChartOptions.tooltips.mode = 'point';
      this.lineChartOptions.scales.yAxes[0].stacked=false;  

      this.probe.locations.forEach((location: any) => {
        this.lineChartData.push({ data:[], label:this.locationLabels[location], steppedLine:steppedLine, fill:false });   
        console.log(this.lineChartData); 
      });

      func = this.handleResponseForOverview;
    }

    this.subscription = this.probeService.getProbeResults(this.probe_id, this.timeRange, this.locName).subscribe(
      func.bind(this), error => {
      })
      
    if (this.chart !== undefined && this.reloadIsRequired) {
      
        this.chart.chart.destroy();
        this.chart.options = this.lineChartOptions;
        this.chart.datasets = this.lineChartData;
        this.chart.labels = this.lineChartLabels;
        this.chart.ngOnInit();
 
        this.reloadIsRequired=false;
     }
  }

  private locationLabels = {};

  ngOnInit() {

    this.probeService.listLocations().subscribe(response=>{

      let locationLabels:any = response;
      locationLabels.forEach((location)=>{
        this.locationLabels[location.locationCode] = location.label;
      });
    }, error => {
    });

    this.probeService.describeProbe(this.probe_id).subscribe(response=>{
      
      this.probe = response;
      
      this.initSubscription();

  }, error => {
      console.log(error)
    })

  }

  ngOnDestroy(){
      this.stopSubscription();
  }
}

