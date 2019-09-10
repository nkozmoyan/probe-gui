import { Injectable } from '@angular/core';

@Injectable()
export class NotfChannelsTypes {

    private channelTypes = [{
        typeKey:'email',
        formType:'email',
        label:'E-mail',
        endpoint:'E-mail',
        msg:'An e-mail with verification link has been sent to:',
        msgInstruction: 'Please verify this channel by visiting the URL in the message.'
      },
      {
        typeKey:'sms',
        formType:'tel',
        label:'SMS', 
        endpoint:'Mobile phone number',
        msg:'A verification code has been sent to:',
        msgInstruction:'Please verify this channel by entering the code below.'
      },   
      {
        typeKey:'webhook',
        formType:'url',
        label:'Webhook', 
        endpoint:'Payload URL',
        msg:`A verification URL has been sent to:`,
        //the endpoint must be ready to receive at least the subscription verification message.
        msgInstruction:'Please retrieve the confirmURL value from the verification message and visit the location specified by confirmURL, for example, using a web browser.'
      }];
    
    public get types() { 
        return this.channelTypes;
      };


    public getPropertyByKey(typeKey){
        return this.channelTypes.find(elem => elem.typeKey === typeKey);
      }


    constructor(){

    }
}

export interface NotfChannel{
  name: string,
  type: string,
  channel: string,

  isVerified?: boolean,
  msg?: string,
  msgInstruction?: string,
  user_id?: string,
  _id?: string,
}