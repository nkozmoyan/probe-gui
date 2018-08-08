import { Component, OnInit } from '@angular/core';
import { ProbeService } from '../../probe/probe-service';

@Component({
  selector: 'app-notf-policies-list',
  templateUrl: './notf-policies-list.component.html',
  styleUrls: ['./notf-policies-list.component.css']
})
export class NotfPoliciesListComponent implements OnInit {

  constructor(private probeService:ProbeService) { }

  policies:{};

  deleteNotifyPolicy(id:any){
    
    this.probeService.deleteNotifyPolicy(id).subscribe( response => {
        this.getList();
    }, error => {
      console.log("Error on deletion:");
      console.log(error)
    })

  }
    
  getList(){
    this.probeService.listNotifyPolicies().subscribe( response => {
          this.policies = response;

          console.log(this.policies);
      },error => {
          console.log(error)
      }
    )
  }

  ngOnInit() {
    this.getList();
  }

}
