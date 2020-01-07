export interface NotificationPolicy {
    _id:string,
    name:string,
    thresholdLoc:number,
    thresholdPolicy:number,
    probeId?:string, 
    recovery?:boolean,
    continuous?:boolean,
    channelIds?:string[]
}

export interface Event {
    _id:string,
    logTime:Date,
    error:boolean,
    probeURL:string,
    probeId:string,
    locName:string,
    try:number,
    subject:string,
    notificationPolicyName:string,
    notificationPolicyId:number,
    notificationPolicyThresholdStatus:string

}

export interface TimeRange {
    type:"absolute" | "relative",
    absoluteRange?:Date[],
    relativeRange?:number
}

export interface MessageBox {
    
    title:string,
    message:string,
    icon?:string
    
    buttons?:{
       primary?:MessageBoxButton,
       cancel?:MessageBoxButton
    }
}

interface MessageBoxButton {
    label:string
}