import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  closeBtnName: string;
  list: any[] = [];

  constructor(public bsModalRef: BsModalRef) { }

  @Output() action = new EventEmitter();

  public onClickOK() {
      this.action.emit(true); //Can send your required data here instead of true
  }
  public onClickCANCEL() {
      this.action.emit(false); //Can send your required data here instead of true
  }

  ngOnInit() {
    this.list.push('PROFIT!!!');
  }

}
