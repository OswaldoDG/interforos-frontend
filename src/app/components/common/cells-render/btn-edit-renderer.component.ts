import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'btn-edit-renderer',
  template: `
    <button
      class="btn btn-outline-primary btn-sm"
      (click)="btnClickedHandler($event)"
    >
      Editar
    </button>
  `,
})
export class BtnEditRenderer implements ICellRendererAngularComp {
  private params: any;
  agInit(params: any): void {
    this.params = params;
  }

  btnClickedHandler(event: any) {
    this.params.clicked(this.params.value);
  }

  refresh() {
    return false;
  }
}
