import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { first } from 'rxjs/operators';
import {
  Consentimiento,
  PersonaClient,
} from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';
import { SessionService } from 'src/app/state/session.service';

@Component({
  selector: 'app-aceptacion-consentimiento',
  templateUrl: './aceptacion-consentimiento.component.html',
  styleUrls: ['./aceptacion-consentimiento.component.scss'],
})
export class AceptacionConsentimientoComponent implements OnInit {
  @Input() consentimiento: Consentimiento = null;
  @Input() LlamarBackend: boolean = false;
  ConsentimientoVisible: boolean = true;
  constructor(
    private personaApi: PersonaClient,
    private sesion: SessionService,
    private sesionQuery: SessionQuery
  ) {}
  ngOnInit(): void {
    if (this.sesionQuery.ShowConsentimientos) {
      if (!this.LlamarBackend) {
        this.ConsentimientoVisible = false;
        this.consentimiento = null;
      }
    } else {
      this.ConsentimientoVisible = false;
    }
  }

  aceptar() {
    if (this.LlamarBackend == true) {
      if (this.consentimiento && this.consentimiento.id == 'c-altamodelos') {
        this.personaApi
          .consentimiento(this.consentimiento.id)
          .pipe(first())
          .subscribe(
            (r) => {
              if (r) {
                this.sesion.adicionaConsentimiento(r);
                this.ConsentimientoVisible = false;
              }
            },
            (error) => {
              this.ConsentimientoVisible = false;
            }
          );
      } else {
        this.ConsentimientoVisible = false;
      }
    } else {
      this.ConsentimientoVisible = false;
    }
  }
}
