import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgIf],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  @Input() title: string;
  @Input() description: string;
  @Input() textButtonOk: string = 'Aceptar';
  @Input() textButtonCancel: string;
  @Output() action = new EventEmitter<'ok' | 'cancel'>;

  emitAction(action: 'ok' | 'cancel') {
    this.action.emit(action);
  }


}
