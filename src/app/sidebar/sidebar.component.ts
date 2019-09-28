import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() sideBar = new EventEmitter();

  constructor(public auth: AuthService, private router: Router) { 

  }
  
  ngOnInit() {

  }

  toggleMenu() {
    this.sideBar.emit();
  }


}
