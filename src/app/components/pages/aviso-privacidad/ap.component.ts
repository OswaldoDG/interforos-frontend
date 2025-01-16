import {
  Component,
  EventEmitter,
  InjectionToken,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClienteViewVacio } from 'src/app/modelos/entidades-vacias';
import { ClienteView } from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';


export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Component({
  selector: 'app-ap-component',
  templateUrl: './ap.html',
  styleUrls: ['./ap-component.scss'],
})
export class APComponent implements OnInit {
  private destroy$ = new Subject();
      c: ClienteView  = ClienteViewVacio();
      constructor(private session: SessionQuery) { }
  
      pageTitleContent = [
        {
          title: 'confirmacion.titulo',
          backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
          error: 'confirmacion.error'
        },
      ];
      
      aviso: string = '<span></span>'

      ngOnDestroy() {
          this.destroy$.next();
          this.destroy$.complete();
        }
  
      ngOnInit(): void {
          this.session.cliente$.pipe(takeUntil(this.destroy$)).subscribe(c=> {
              this.c = c;
              this.aviso =c.consentimientos[0].contenidoHTML;
          });
      }

}
