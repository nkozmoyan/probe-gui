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

export interface Incident {
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