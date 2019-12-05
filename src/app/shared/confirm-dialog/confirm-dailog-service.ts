import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs/operators/take';

@Injectable()
export class ConfirmDialogService {
    
    constructor(private modalService: BsModalService){
    }

    bsModalRef: BsModalRef;


    public confirm(next){
  
      const initialState = {
        message: 'Are you sure that you want to delete?',
      };

      this.bsModalRef = this.modalService.show(ConfirmDialogComponent, {initialState});
  
      this.bsModalRef.content.action.pipe(take(1))
              .subscribe((value) => {
  
                if (value){
                  next(true);
                }

                this.bsModalRef.hide();
  
               }, (err) => {
                  next(false);
          });
      this.bsModalRef.content.closeBtnName = 'Close';
      
    }

}
