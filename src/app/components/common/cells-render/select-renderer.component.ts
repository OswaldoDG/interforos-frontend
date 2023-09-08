import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-select-renderer',
  template: `
    <select [(ngModel)]="value" (change)="onSelectChange()">
      <option [value]="null">{{'proyectos.drop-enedicion' | translate}}</option>
      <option [value]="'Abierto'">{{'proyectos.drop-abierto' | translate}}</option>
      <option [value]="'Cerrado'">{{'proyectos.drop-cerrado' | translate}}</option>
      <option [value]="'Cancelado'">{{'proyectos.drop-cancelado' | translate}}</option>
    </select>
  `,
})
export class SelectRendererComponent implements ICellRendererAngularComp {
  value: any;
  options: string[];

  params: any;

  agInit(params: any): void {
    this.params = params;
    this.options = params.data.options;

    if (this.params.value === null) {
      this.value = 'En Edición';
    } else {
      this.value = params.value;
    }
  }

  refresh(params: any): boolean {
    this.params = params;
    this.value = params.value;
    return true;
  }

  onSelectChange(): void {
    this.params.setValue(this.value);
  }
}
