import { Component, OnInit } from '@angular/core';
import { Probe } from '../probe';

@Component({
  selector: 'app-probes',
  templateUrl: './probes.component.html',
  styleUrls: ['./probes.component.css']
})
export class ProbesComponent implements OnInit {

  hero = 'Windstorm';

  constructor() { }

  ngOnInit() {
  }

}
