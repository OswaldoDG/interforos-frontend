import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'btn-close-renderer',
  template: `
    <button class="btn-close" (click)="btnClickedHandler($event)"></button>
  `,
})
export class BtnCloseRenderer implements ICellRendererAngularComp {
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
