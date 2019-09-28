import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cloudprobes.com';

  constructor(public auth: AuthService){}

  public _opened: boolean = true;
  public minWidth: number = 567;

  public get mode(){
    return this.isSmall ? 'slide' : 'push';
  }

  public get isSmall(){
    return window.innerWidth < this.minWidth;
  }

  public toggleMenu(){
    this._toggleSidebar();
  }
  public _toggleSidebar() {
    this._opened  = !this._opened;
  }

}
