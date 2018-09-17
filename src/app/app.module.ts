import { RecaptchaModule } from 'ng-recaptcha';
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

import {PasswordMatchDirective} from './util/password-match';
import { NotfPoliciesListComponent } from './notf-policies/notf-policies-list/notf-policies-list.component';
import { NotfPoliciesEditComponent } from './notf-policies/notf-policies-edit/notf-policies-edit.component';
import { NotfChannelsEditComponent } from './notf-channels/notf-channels-edit/notf-channels-edit.component';
import { NotfChannelsListComponent } from './notf-channels/notf-channels-list/notf-channels-list.component';

const appRoutes:Routes = [
  { path:'', component: HomeComponent,canActivate: [AuthGuard] },
  { path:'probes', component: ProbesComponent,canActivate: [AuthGuard]  },
  { path:'probe/:id', component: ProbeComponent,canActivate: [AuthGuard]  },
  { path:'probe-edit/:id', component: ProbeEditComponent,canActivate: [AuthGuard]  },
  { path:'probe-edit', component: ProbeEditComponent,canActivate: [AuthGuard]  },

  { path:'notf-policies', component: NotfPoliciesListComponent,canActivate: [AuthGuard]  },
  { path:'notf-policies-edit/:id', component: NotfPoliciesEditComponent,canActivate: [AuthGuard]  },
  { path:'notf-policies-new', component: NotfPoliciesEditComponent,canActivate: [AuthGuard]  },

  { path:'notf-channels', component: NotfChannelsListComponent,canActivate: [AuthGuard]  },
  { path:'notf-channels-edit/:id', component: NotfChannelsEditComponent,canActivate: [AuthGuard]  },
  { path:'notf-channels-new', component: NotfChannelsEditComponent,canActivate: [AuthGuard]  },

  
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

export function tokenGetter() {
  return localStorage.getItem('access_token');
}


@NgModule({
  declarations: [
    PasswordMatchDirective,
    AppComponent,
    ProbesComponent,
    ProbeComponent,
    HeaderComponent,
    ProbeEditComponent,
    ProbesListComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NotfPoliciesListComponent,
    NotfPoliciesEditComponent,
    NotfChannelsEditComponent,
    NotfChannelsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    RecaptchaModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3050','app.cloudprobes.com']
      }
    }),
    BsDropdownModule.forRoot(),
    ChartsModule

  ],
  providers: [ProbeService,AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }