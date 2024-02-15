import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  CastingClient,
  PermisosCasting,
  Persona,
} from 'src/app/services/api/api-promodel';
import { environment } from 'src/environments/environment';

import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { SessionQuery } from 'src/app/state/session.query';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-persona-card',
  templateUrl: './persona-card.component.html',
  styleUrls: ['./persona-card.component.scss'],
})
export class PersonaCardComponent implements OnInit {
  @Input() persona: Persona = null;
  @Output() personaEditar: EventEmitter<string> = new EventEmitter();
  @Output() personaRemover: EventEmitter<string> = new EventEmitter();
  @Output() personaCargada: EventEmitter<boolean> = new EventEmitter();
  @Output() uid: EventEmitter<string> = new EventEmitter();
  mobile: boolean = false;
  notFoundURL: string = 'assets/img/errorMedio.jpg';
  avatarUrl: string = 'assets/img/errorMedio.jpg';
  videoCasting: any;
  fotoCasting: any;
  tieneVideo: boolean = false;
  imagenes = [];
  tabHome = '';
  tabHomeBtn = '';
  mostrarBandera: boolean = false;
  configCarousel = {
    height: '250px',
    space: 1,
  };
  enCasting: boolean = null;
  T: any;
  enCategoria: boolean = null;
  usuarioFinal: string = undefined;
  nombrePersona: string;
  constructor(
    private bks: BreakpointObserver,
    private personaService: PersonaInfoService,
    private servicio: CastingStaffServiceService,
    private castingService: CastingClient,
    private toastService: HotToastService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.persona != null) {
      this.usuarioFinal = this.persona.id;

      if (this.persona?.elementoMedioPrincipalId) {
        this.avatarUrl = `${environment.apiRoot}/contenido/${this.usuarioFinal}/${this.persona.elementoMedioPrincipalId}/thumb`;
      }
      this.validarExiste();
    }
  }

  ngOnInit(): void {
    this.spinner.show('loadMedios');
    this.bks
      .observe(['(min-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = false;
        } else {
          this.mobile = true;
        }
      });
    this.servicio.CategoriaSub().subscribe((e) => {
      this.validarExiste();
    });
    this.translate.get(['buscar.categorias-error']).subscribe((ts) => {
      this.T = ts;
    });
    this.getNombreModelo();
    const nombreModelo =
      this.persona.nombre +
      ' ' +
      this.persona.apellido1 +
      ' ' +
      this.persona.apellido2;
    this.servicio.setNombreModelo(nombreModelo);
  }
  validarExiste() {
    if (this.servicio.CastingIdActual() && this.servicio.CategoriActual()) {
      this.mostrarBandera = true;
    }
    this.enCasting =
      this.servicio
        .CastingsPersona(this.persona.id)
        .indexOf(this.servicio.CategoriActual()) >= 0;
    if (this.servicio.personaEnCategoria(this.persona.id) >= 0) {
      this.enCategoria = true;
    } else {
      this.enCategoria = false;
    }
  }
  onChangeCheckBox(id: string) {
    if (this.servicio.CastingIdActual() && this.servicio.CategoriActual()) {
      if (this.enCasting) {
        this.castingService
          .modeloPut(
            this.servicio.CastingIdActual(),
            id,
            this.servicio.CategoriActual()
          )
          .subscribe((d) => {
            this.servicio.agregarModelo(id, this.servicio.CategoriActual());
            this.enCategoria = !this.enCategoria;
          });
      } else {
        this.castingService
          .modeloDelete(
            this.servicio.CastingIdActual(),
            id,
            this.servicio.CategoriActual()
          )
          .subscribe((d) => {
            this.servicio.removerModelo(id, this.servicio.CategoriActual());
            this.enCategoria = !this.enCategoria;
          });
      }
    } else {
      this.enCasting = !this.enCasting;
      this.enCategoria = !this.enCategoria;
      this.toastService.warning(this.T['buscar.categorias-error'], {
        position: 'bottom-center',
      });
    }
  }

  editarPersona() {
    if (this.persona) {
      this.personaEditar.emit(this.persona.id);
    }
  }
  removerPersona() {
    if (this.persona) {
      this.personaRemover.emit(this.persona.id);
    }
  }
  verMedios() {
    this.uid.emit(this.persona.id);
  }

  selectTab() {
    this.traerMedios();
  }

  traerMedios() {
    this.personaService
      .obtieneMediosPErsona(this.usuarioFinal)
      .subscribe((m) => {
        m.elementos.forEach((e) => {
          if (e.imagen) {
            this.imagenes.push({
              image: `${environment.apiRoot}/contenido/${m.usuarioId}/${e.id}/full`,
              thumbImage: `${environment.apiRoot}/contenido/${m.usuarioId}/${e.id}/card`,
            });
          } else {
            if (e.video) {
              this.imagenes.push({
                video: `https://drive.google.com/uc?export=download&id=${e.id}`,
                posterImage: `${environment.apiRoot}/contenido/${m.usuarioId}/${e.frameVideoId}/thumb`,
              });
            }
          }
        });
        this.personaCargada.emit(false);
      });
  }

  getNombreModelo() {
    var nombre =
      this.persona.nombre +
      ' ' +
      this.persona.apellido1 +
      ' ' +
      this.persona.apellido2;

    if (nombre.length > 25) {
      this.nombrePersona = `${nombre.slice(0, 24)}...`.toUpperCase();
    } else {
      this.nombrePersona = `${nombre.slice(0, 24)}`.toUpperCase();
    }
  }
}
