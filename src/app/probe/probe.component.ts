import { Component, OnInit, ViewChild, Pipe, TemplateRef, OnDestroy } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ProbeService } from './probe-service';
import { ActivatedRoute,Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { ConfirmDialogService } from '../shared/confirm-dialog/confirm-dailog-service';
import { TimeRange } from '../interface/interface';
import * as moment from 'moment';

@Pipe({
  name: 'reverse'
})

@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.scss']
})
export class ProbeComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective, { static: true }) private chart: BaseChartDirective;

  public probe:any = {
    locations:[]
  };    

  
  public datepickerRangeValue: Date[];
  public timepickerRangeValue:Date[];
  public calendarRange:Date[]= [];

  public endDate = new Date();
  public startDate = new Date();

  public timeRange:TimeRange = {
    type:'relative',
    relativeRange:60
  }
  
  public timeGranularity: any;

  constructor(
    private probeService:ProbeService, 
    private router: Router,
    private route: ActivatedRoute, 
    private confirmDialogService: ConfirmDialogService) {

      this.startDate.setDate(this.startDate.getDate() - 7);
      this.startDate.setHours(0,0,0,0);
      this.endDate.setHours(23,59,59,999);

      this.datepickerRangeValue = [this.startDate, this.endDate];
      this.timepickerRangeValue = [this.startDate, this.endDate];
    }

  confirmDeletion(id){

    this.confirmDialogService.confirm(resp =>{
      if(resp){
        this.deleteProbe(id);
      }
    })
      
  }

  deleteProbe(id:any){
    
    this.probeService.deleteProbe(id).subscribe( response => {
      this.router.navigate(['/probes']);
    }, error => {
      console.log("Error on deletion:",error);
    })

  }


  toggleProbeStatus(probeId,setStatus){

    this.probe['active'] = setStatus;

    if (setStatus){
      this.stopSubscription();
    } else {
      this.restartSubscription();
    }
    
    this.probeService.updateProbe(probeId, {active:setStatus}).subscribe( response => {
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
      intersect:true,
      callbacks: {

          beforeTitle	: (tooltipItem, data) => {
            if (this.timeGranularity!=1){
              return 'Averaged over ' + this.timeGranularity + ' min.';
            } else {
              return;
            }
            
          },
          
          title : (tooltipItems, data) =>{
            
            let date: moment.Moment = moment(tooltipItems[0].xLabel);

            if (this.timeGranularity!=1){
               let periodEnd = date.clone();
                periodEnd.add(this.timeGranularity, 'minutes');
               
              if(date.year() === periodEnd.year() && date.dayOfYear() === periodEnd.dayOfYear()){
                return date.format("h:mm A") + ` - ` + periodEnd.format("h:mm A, L");
               } else {
                return date.format("h:mm A, L") + ` - ` + periodEnd.format("h:mm A, L");
               }

            } else {
              return date.format("h:mm A, L")
            }


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
              if (this.aggregated){
                label += 'Avg. ' + Math.round(tooltipItem.yLabel as number) + ' ms';  
              } else {
                label += Math.round(tooltipItem.yLabel as number) + ' ms';
              }
              
            }
            return label;
          }.bind(this),

          footer : (tooltipItem, data)=> {
            
            if(tooltipItem.length<2){
              return;
            }

            let value:number = 0;
            
            for (let item of tooltipItem){
              value += <number>item.yLabel;
            }

            if (tooltipItem[0].datasetIndex !== 0) { 
              return 'Total time: ' + Math.round(value) as string + ' ms';
            }   
            return '';
          }
      }
  },
    scales: {
      xAxes: [{ 
          type: 'time',
          distribution: 'linear',
          time:{  
            minUnit: 'minute',
            displayFormats: {
              minute: 'h:mm a'
            },
            //tooltipFormat:'h:mm A, L'
          },
          ticks: {
            maxTicksLimit: 11,
            maxRotation: 0,
            minRotation: 0
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
          display: false,
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
  }
 
  public chartHovered(e:any):void {
  }
  public allTimeRanges = [
    {value: 60, label: '1 Hour'},
    {value: 6*60, label: '6 Hours'},
    {value: 24*60, label: '24 Hours'},
    {value: 3*24*60, label: '3 Days'},
    {value: 7*24*60, label: '7 Days'},
    {value: 20*24*60, label: '30 Days'}

  ];


  public locName:string = '';

  private reloadIsRequired=true;
  public aggregated:Boolean=false;

  public setAbsoluteTimeRange(pop){

    this.timeRange.type = 'absolute';
    
    this.datepickerRangeValue[0].setHours(this.timepickerRangeValue[0].getHours(), this.timepickerRangeValue[0].getMinutes(), this.timepickerRangeValue[0].getSeconds());
    this.datepickerRangeValue[1].setHours(this.timepickerRangeValue[1].getHours(), this.timepickerRangeValue[1].getMinutes(), this.timepickerRangeValue[1].getSeconds());

    this.timeRange.absoluteRange = [this.datepickerRangeValue[0], this.datepickerRangeValue[1]];
    
    this.reloadIsRequired = true;
    this.restartSubscription();

    pop.hide();
  }

  public setTimeRange(timeRange:number){

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
    
    this.timeRange = {
      type:'relative',
      relativeRange:timeRange
    };
    this.reloadIsRequired = true;

    this.restartSubscription();
    
  }

  public setLocation(location:string){
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


  probeId = this.route.snapshot.paramMap.get('id');
  
  public probeResults:Array<Object>;
  private failureMessages;

  private handleResponseForOverview(response:any){

    this.timeGranularity = response.headers.get('X-Time-Granularity');

    let chartData = {Failures:[]};
    let datapoint;
    let failureMessages = [];
    let responseProps = Object.keys(response.body); // Making an array from fetched JSON.
    let responseArray:any[] = []; // intermediate variable for keeping array
    let lastResponse = [];

    this.noData = (responseProps.length === 0) ? true : false;

    for (let i of responseProps) {
      let periodEnd = new Date(response.body[i]['probeTime']);

      let d = new Date(response.body[i]['probeTime']); 
      d.setMinutes(d.getMinutes() + this.timeGranularity);

     
      responseArray.push(response.body[i]);

      let locationLabel  = this.locationLabels[response.body[i]['locName']];

      if (!chartData.hasOwnProperty(locationLabel)){
        chartData[locationLabel] = [];
      }

      if (response.body[i]['error'] || response.body[i]['failures']){
        chartData['Failures'].push({ t:response.body[i]['probeTime'],y:response.body[i]['responseTime'] || lastResponse[response.body[i]['locName']]});
        failureMessages.push({ locName:response.body[i]['locName'], error:response.body[i]['error'] || response.body[i]['failures'] + ` failure` });
      } else {
        lastResponse[response.body[i]['locName']] = response.body[i]['responseTime'];
      }

      datapoint = response.body[i]['responseTime'] || NaN;
      chartData[locationLabel].push({ t:response.body[i]['probeTime'], y:datapoint });
    
    }
    
    this.probeResults = responseArray.reverse();
    this.failureMessages = failureMessages;
    this.lineChartData.forEach((x) => {
      if(chartData[x.label]!==undefined)
        x.data = chartData[x.label];
    });
    
  }


  private handleResponse(response:any){

    this.timeGranularity = response.headers.get('X-Time-Granularity');

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

    this.probeResults = Object.keys(response.body).map((i) => { 
      return response.body[i];
    }).reverse();

    this.noData = (this.probeResults.length === 0) ? true : false;

    let responseKeys = Object.keys(response.body); // Making an array from fetched JSON.
    let datapoint;
    let failureMessages = [];

    for (let i of responseKeys) { 
      
      for(let key of Object.keys(timingPhases)){

        if (response.body[i]['error'] || response.body[i]['failures']){
  
          if(key === 'failures') {
            failureMessages.push({error:response.body[i]['error'] || `Failures: ` + response.body[i]['failures'] });
            datapoint = 0;
          } else {
            datapoint = response.body[i]['timingPhases'] ? response.body[i]['timingPhases'][key] : NaN;
          }
       
          timingPhases[key].data.push({ t:response.body[i]['probeTime'], y:datapoint})

        }  else  {

          if(key === 'failures'){
            failureMessages.push({error:null});
            datapoint = NaN;
          } else {
            datapoint = response.body[i]['timingPhases'][key];
          }

          timingPhases[key].data.push({ t:response.body[i]['probeTime'], y:datapoint})
        }
      }
    }

    this.failureMessages = failureMessages;
    this.lineChartData.forEach((x) => {
      x.data = timingPhases[getKeyByLabel(timingPhases,x.label)].data;
    });
  }

  private subscription ;

  private initSubscription(){

    let func:Function;
    //let steppedLine =  this.aggregated ? true : false;
    let steppedLine = false;
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
      this.lineChartOptions.tooltips.mode = 'nearest';
      this.lineChartOptions.scales.yAxes[0].stacked=false;  

      this.probe.locations.forEach((location: any) => {
        this.lineChartData.push({ data:[], label:this.locationLabels[location], steppedLine:steppedLine, fill:false });   
      });

      func = this.handleResponseForOverview;
    }

    this.subscription = this.probeService.getProbeResults(this.probeId, this.timeRange, this.locName).subscribe(
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

    this.route.queryParams
      .filter(params => params.startDate)
      .subscribe(params => {
       if(params.startDate && params.endDate){

          this.timeRange = {
              type:'absolute',
              absoluteRange:[ new Date(params.startDate), new Date(params.endDate) ]
        }
          this.datepickerRangeValue = this.timeRange.absoluteRange;
          this.timepickerRangeValue = this.datepickerRangeValue;
       }
      })

    this.probeService.listLocations().subscribe(response=>{

      let locationLabels:any = response;
      locationLabels.forEach((location)=>{
        this.locationLabels[location.locationCode] = location.label;
      });
    }, error => {});

    this.probeService.describeProbe(this.probeId).subscribe(response=>{
      
      this.probe = response;

      this.calendarRange[0] = response['createdAt'] ? new Date(response['createdAt']) : new Date('2019-11-01T00:00:00');
      this.calendarRange[1] = new Date();

      this.initSubscription();

  }, error => {
      console.log(error)
    })

  }

  ngOnDestroy(){
      this.stopSubscription();
  }
}

