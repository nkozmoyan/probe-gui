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