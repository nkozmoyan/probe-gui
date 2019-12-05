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
import { PaymentService } from './util/stripe';

import { NotfChannelsTypes } from './notf-channels/notf-channels-types';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';


import { Ng5SliderModule } from 'ng5-slider';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input' ;

import { SidebarModule } from 'ng-sidebar';

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
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChannelsDialogComponent } from './shared/channels-dialog/channels-dialog.component';
import { ChannelsDialogService } from './shared/channels-dialog/channels-dailog-service';
import { ConfirmDialogService } from './shared/confirm-dialog/confirm-dailog-service';
import { EventsComponent } from './events/events.component';

import { NgxStripeModule } from 'ngx-stripe';
import { PaymentMethodComponent } from './payment-method/payment-method-selection/payment-method.component';
import { SmsBalanceComponent } from './sms-balance/sms-balance.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PaymentMethodListComponent } from './payment-method/payment-method-list/payment-method-list.component';


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
  { path:'', component: ProbesListComponent,canActivate: [AuthGuard] },
  
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
  { path:'events', component: EventsComponent,canActivate: [AuthGuard]},

  { path:'account', component: AccountComponent,canActivate: [AuthGuard]},

  { path:'sms-balance', component: SmsBalanceComponent, canActivate: [AuthGuard]},

  
  { path: 'login', component: LoginComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent},

  { path: 'signup', component: SignupComponent},

  { path: 'confirmation/:token', component: ConfirmationComponent},
  { path: '**', component: PageNotFoundComponent}

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
    ConfirmDialogComponent,
    PageNotFoundComponent,
    ChannelsDialogComponent,
    EventsComponent,
    PaymentMethodComponent,
    SmsBalanceComponent,
    SubscriptionComponent,
    PaymentMethodListComponent
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
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    Ng5SliderModule,
    SidebarModule.forRoot(),
    NgxStripeModule.forRoot('pk_test_bitauvn6cvFX2kmm762y5Z9F00WjHY9xIa')

  ],
  providers: [ChannelsDialogService, ConfirmDialogService, ProbeService, PaymentService, NotfChannelsTypes, AuthService, AuthGuard],
  entryComponents: [ConfirmDialogComponent, ChannelsDialogComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }