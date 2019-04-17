export class Probe {

  probeURL:string;
  interval:number;
  port:number;
  method:string;
  matchPolicy?:{
    keywords:string[],
    matchAll:boolean
  };
  policy?:string;
  requestBody?:string;
  requestBodyJson?:boolean;
  headers?:[{
    key:string,
    value:string
  }];
  basicAuth?:{
    user:string,
    password:string
  }
}
