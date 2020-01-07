import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MessageBox } from '../../interface/interface';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})

export class MessageBoxComponent implements OnInit {

  constructor() { }

  @Input() messageBoxData:MessageBox;
  @Output() action = new EventEmitter<any>();

  btnAction(btn){
    this.action.emit(btn);
  }

  ngOnInit() {
   
  }

}
