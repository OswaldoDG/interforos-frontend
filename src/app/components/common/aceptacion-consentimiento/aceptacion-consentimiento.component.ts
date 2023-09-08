import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Consentimiento } from 'src/app/services/api/api-promodel';

@Component({
  selector: 'app-aceptacion-consentimiento',
  templateUrl: './aceptacion-consentimiento.component.html',
  styleUrls: ['./aceptacion-consentimiento.component.scss'],
})
export class AceptacionConsentimientoComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() consentimiento: Consentimiento = null;
  @Output() Aceptado: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  aceptar() {
    this.Aceptado.emit(this.consentimiento.id);
    this.visible = !this.visible;
  }
}
