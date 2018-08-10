export class Probe {

  constructor(

      public probeURL:string,
      public interval:number,
      public port:number,
      public method:string,
      public notification_policy_id?:string,
      public matchPolicy?:{keywords:string[],exactMatch:boolean},
      public body?:string,
      public json?:boolean,
      public headers?:{},
      public auth?:{user:string,paswd:string}
  
  ){
  }

}
