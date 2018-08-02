import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth/auth.service';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';


const appRoutes:Routes = [
  { path:'', component: HomeComponent },
  { path:'probes', component: ProbesComponent,canActivate: [AuthGuard]  },
  { path:'probe/:id', component: ProbeComponent,canActivate: [AuthGuard]  },
  { path:'probe-edit/:id', component: ProbeEditComponent,canActivate: [AuthGuard]  },
  { path:'probe-edit', component: ProbeEditComponent,canActivate: [AuthGuard]  },
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

export function tokenGetter() {
  return localStorage.getItem('access_token');
}


@NgModule({
  declarations: [
    AppComponent,
    ProbesComponent,
    ProbeComponent,
    HeaderComponent,
    ProbeEditComponent,
    ProbesListComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3050']
      }
    }),
    BsDropdownModule.forRoot(),
    ChartsModule

  ],
  providers: [ProbeService,AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }