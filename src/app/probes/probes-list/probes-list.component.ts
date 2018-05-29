import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-probes-list',
  templateUrl: './probes-list.component.html',
  styleUrls: ['./probes-list.component.css']
})
export class ProbesListComponent implements OnInit {

  constructor() { 

   

  }

 probes = [{
   probeURL:"src.am"
 },
 {
  probeURL:"35mm.am"
}];
  
 ngOnInit() {
  }

}
