import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { ProbesComponent } from './probes/probes.component';
import { ProbeComponent } from './probe/probe.component';
import { HeaderComponent } from './header/header.component';
import { ProbeEditComponent } from './probe/probe-edit/probe-edit.component';
import { ProbesListComponent } from './probes/probes-list/probes-list.component';
import { HomeComponent } from './home/home.component';

import { ProbeService } from './probe/probe-service';

const appRoutes:Routes = [
  { path:'', component: HomeComponent },
  { path:'probes', component: ProbesComponent },
  { path:'probe/:id', component: ProbeComponent },
  { path:'probe-edit/:id', component: ProbeEditComponent },
  { path:'probe-edit', component: ProbeEditComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProbesComponent,
    ProbeComponent,
    HeaderComponent,
    ProbeEditComponent,
    ProbesListComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ChartsModule

  ],
  providers: [ProbeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
