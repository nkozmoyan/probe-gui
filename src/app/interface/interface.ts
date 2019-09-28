export interface NotificationPolicy {
    _id:string,
    name:string,
    threshold_loc:number,
    threshold_policy:number,
    probe_id?:string, 
    recovery?:boolean,
    continuous?:boolean,
    channel_ids?:string[]
}

export interface Incident {
    _id:string,
    logTime:Date,
    error:boolean,
    probeURL:string,
    probe_id:string,
    locName:string,
    try:number,
    subject:string,
    notification_policy_name:string,
    notification_policy_id:number,
    notification_policy_threshold_status:string

}