import { Component, OnInit,ViewChild, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import { ProbeService } from '../../probe/probe-service';
import { ChannelsPopoverComponent } from '../channels-popover/channels-popover.component';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs/operators/take';

@Component({
  selector: 'app-notf-policies-list',
  templateUrl: './notf-policies-list.component.html',
  styleUrls: ['./notf-policies-list.component.css']
})
export class NotfPoliciesListComponent implements OnInit {


  @ViewChild('childModal', { static: false }) childModal: ModalDirective;

  showChildModal(channel_ids): void {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(ChannelsPopoverComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.channel_ids = channel_ids;
    this.childModal.show();
  }
 
  hideChildModal(): void {
    this.componentRef.destroy();
    this.childModal.hide();
  }

  componentRef: any;
  @ViewChild('channelsPopover', { static:false, read: ViewContainerRef }) entry: ViewContainerRef;
  bsModalRef: BsModalRef;

  constructor(private probeService:ProbeService, private resolver: ComponentFactoryResolver, private modalService: BsModalService) { }

  showChannels(content) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(ChannelsPopoverComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.content = content;
  }
  
  destroyComponent() {
      this.componentRef.destroy();
  }

  confirmDeletion(id){

    id  = id || '';

    const initialState = {
      id:id,
      title: 'Value = ' + id,
      message: 'Are you sure that you want to delete this policy?',
    };
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});

    this.bsModalRef.content.action.pipe(take(1))
            .subscribe((value) => {

              if (value) this.deleteNotifyPolicy(id);

              this.bsModalRef.hide();

             }, (err) => {
                 return false;
        });
    this.bsModalRef.content.closeBtnName = 'Close';

  }


  policies:{};

  deleteNotifyPolicy(id:any){
    
    this.probeService.deleteNotifyPolicy(id).subscribe( response => {
        this.getList();
    }, error => {
      console.log("Error on deletion:");
      console.log(error)
    })

  }
    
  getList(){
    this.probeService.listNotifyPolicies().subscribe( response => {
          this.policies = response;
      },error => {
          console.log(error)
      }
    )
  }


  ngOnInit() {
    this.getList();
  }

}
