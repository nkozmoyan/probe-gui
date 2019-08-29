import { RecaptchaModule } from 'ng-recaptcha';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION,
  PB_DIRECTION, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from "@angular/common"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ProbeComponent } from './probe/probe.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProbeEditComponent } from './probe/probe-edit/probe-edit.component';
import { ProbesListComponent } from './probes/probes-list/probes-list.component';
import { HomeComponent } from './home/home.component';

import { ProbeService } from './probe/probe-service';
import { NotfChannelsTypes } from './notf-channels/notf-channels-types';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Ng5SliderModule } from 'ng5-slider';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input' ;

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth/auth.service';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';

import { PasswordMatchDirective } from './util/password-match';
import { NotfPoliciesListComponent } from './notf-policies/notf-policies-list/notf-policies-list.component';
import { NotfPoliciesEditComponent } from './notf-policies/notf-policies-edit/notf-policies-edit.component';

import { NotfChannelsEditComponent } from './notf-channels/notf-channels-edit/notf-channels-edit.component';
import { NotfChannelsListComponent } from './notf-channels/notf-channels-list/notf-channels-list.component';
import { NotfChannelsVerifyComponent } from './notf-channels/notf-channels-verify/notf-channels-verify.component';

import { ConfirmationComponent } from './confirmation/confirmation.component';
import { NotfHistoryComponent } from './notf-history/notf-history.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccountComponent } from './account/account.component';
import { HeaderComponent } from './header/header.component';
import { ChannelsPopoverComponent } from './notf-policies/channels-popover/channels-popover.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

import { AngularSvgIconModule } from 'angular-svg-icon';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#7c99d2",
  bgsOpacity: 0.6,
  bgsPosition: "center-center",
  bgsSize: 50,
  bgsType: "wandering-cubes",
  blur: 5,
  //fgsColor: "#00ACC1",
  //fgsPosition: "center-center",
  //fgsSize: 60,
  //fgsType: "ball-spin-clockwise",
  gap: 54,
  logoPosition: "center-center",
  logoSize: 120,
  logoUrl: "",
  masterLoaderId: "master",
  overlayBorderRadius: "0",
  overlayColor: "rgba(40, 40, 40, 0.8)",
  pbColor: "#00ACC1",
  pbDirection: "ltr",
  pbThickness: 7,
  hasProgressBar: true,
  text: "",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  threshold: 500
};


const appRoutes:Routes = [
  { path:'', component: HomeComponent,canActivate: [AuthGuard] },
  
  { path:'probes', component: ProbesListComponent,canActivate: [AuthGuard]  },
  
  { path:'probe/:id', component: ProbeComponent,canActivate: [AuthGuard]  },
  { path:'probe-edit/:id', component: ProbeEditComponent,canActivate: [AuthGuard]  },
  { path:'probe-edit', component: ProbeEditComponent,canActivate: [AuthGuard]  },

  { path:'notf-policies', component: NotfPoliciesListComponent,canActivate: [AuthGuard]  },
  { path:'notf-policies-edit/:id', component: NotfPoliciesEditComponent,canActivate: [AuthGuard]  },
  { path:'notf-policies-new', component: NotfPoliciesEditComponent,canActivate: [AuthGuard]  },

  { path:'notf-channels', component: NotfChannelsListComponent,canActivate: [AuthGuard]  },
  { path:'notf-channels-edit/:id', component: NotfChannelsEditComponent,canActivate: [AuthGuard]  },
  { path:'notf-channels-new', component: NotfChannelsEditComponent,canActivate: [AuthGuard]  },

  { path:'notf-channels-verify/:id', component: NotfChannelsVerifyComponent,canActivate: [AuthGuard]  },


  { path:'notf-history', component: NotfHistoryComponent,canActivate: [AuthGuard]},
  { path:'account', component: AccountComponent,canActivate: [AuthGuard]},

  
  { path: 'login', component: LoginComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent},

  { path: 'signup', component: SignupComponent},

  { path: 'confirmation/:token', component: ConfirmationComponent}

];

export function tokenGetter() {
  return localStorage.getItem('access_token');
}


@NgModule({
  declarations: [
    PasswordMatchDirective,
    AppComponent,
    ProbeComponent,
    SidebarComponent,
    ProbeEditComponent,
    ProbesListComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NotfPoliciesListComponent,
    NotfPoliciesEditComponent,
    NotfChannelsEditComponent,
    NotfChannelsListComponent,
    ConfirmationComponent,
    NotfHistoryComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AccountComponent,
    HeaderComponent,
    NotfChannelsVerifyComponent,
    ChannelsPopoverComponent,
    ConfirmDialogComponent
  ],
  imports: [
    AngularSvgIconModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    //NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
    NgxUiLoaderHttpModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    RecaptchaModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3050','api.cloudprobes.com']
      }
    }),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    ChartsModule,
    Ng5SliderModule

  ],
  providers: [ProbeService,NotfChannelsTypes, AuthService,AuthGuard],
  entryComponents: [ChannelsPopoverComponent, ConfirmDialogComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }