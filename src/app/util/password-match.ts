import { Validator,ValidatorFn, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive, forwardRef, Attribute } from '@angular/core';

export function passwordMatch(control: AbstractControl):{[key: string]: boolean}  {
     
    //Grab pwd and confirmPwd using control.get
    const pwd = control.get('pwd');
    const confirmPwd = control.get('confirmPwd');
       
    // If FormControl objects don't exist, return null
    if (!pwd || !confirmPwd) return null;
     
    //If they are indeed equal, return null
     if (pwd.value === confirmPwd.value) {
      return null;
    }

    if (!pwd.value || !confirmPwd.value) {
      return null;
    }

   //Else return false

   return {
      mismatch: true };
   }
 
   
//PasswordMatchDirective  
@Directive({
    selector: '[passwordMatch][ngModelGroup]', //1
    providers: [ //2
      {
        provide: NG_VALIDATORS, 
        useValue: passwordMatch, 
        multi: true
      }
    ]
  })
   
  export class PasswordMatchDirective {
  }