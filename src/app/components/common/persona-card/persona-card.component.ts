import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CastingClient, PermisosCasting, Persona } from 'src/app/services/api/api-promodel';
import { environment } from 'src/environments/environment';

import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { SessionQuery } from 'src/app/state/session.query';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-persona-card',
  templateUrl: './persona-card.component.html',
  styleUrls: ['./persona-card.component.scss'],
})
export class PersonaCardComponent implements OnInit {
  @Input() persona: Persona = null;
  @Output() personaEditar: EventEmitter<string> = new EventEmitter();
  @Output() personaRemover: EventEmitter<string> = new EventEmitter();
  @Output() uid: EventEmitter<string> = new EventEmitter();
  //Determina si el despliegue debe ser vertial
  @Input() direccionVertical: boolean = true;
  //Determina si la tarjeta se encuentra en una pantalla de búsqueda o en la resivión de modelos
  @Input() tipoBusqueda: boolean = false;
  //Determina si el avatar con la imagen principal del usuario debe mostrarse
  @Input() mostrarAvatar: boolean = true;
  //Determina si la lista de habilidades debe ser mostrada
  @Input() mostrarHabilidades: boolean = true;
  //Determina si los datos de contacto deben mostrase
  @Input() mostrarContacto: boolean = true;
  //Determina si los datos generales deben mostrarse
  @Input() mostrarGenerales: boolean = true;
  //Determina si la galeria debe mostrarse
  @Input() mostrarGaleria: boolean = true;
  //Determina si se muestran los controles de Mismodelos
  @Input() mostarControlesMisModelos: boolean = false;
  //vista para staff
  @Input() modoStaff: boolean = false;
  //Vista Para revisor
  @Input() modoRevisor: boolean = false;
  //Permisos
  @Input() verRedesSociales : boolean = true;
  @Input() verTelefono : boolean = true;
  @Input() verEmail : boolean = true;
  @Input() verDireccion : boolean = true;
  @Input() verComentarios : boolean = true;
  mobile: boolean = false;
  avatarUrl: string = 'assets/img/avatar-404.png';
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
  constructor(
    private bks: BreakpointObserver,
    private personaService: PersonaInfoService,
    private servicio: CastingStaffServiceService,
    private castingService: CastingClient,
    private toastService: HotToastService,
    private translate: TranslateService,
    private session: SessionQuery
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.persona != null) {
      if (this.persona.usuarioId) {
        this.usuarioFinal = this.persona.usuarioId;
      } else {
        this.usuarioFinal = this.persona.id;
      }

      if (this.persona?.elementoMedioPrincipalId) {
        this.avatarUrl = '${environment.apiRoot}/contenido/${this.usuarioFinal}/${this.persona.elementoMedioPrincipalId}/thumb';
      }
      if (this.modoRevisor) {
        this.traerMedios();
      }
      this.validarExiste();
    }
  }

  ngOnInit(): void {
    console.log(this.verDireccion);
    console.log(this.persona.contacto.telefono);
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
    const nombreModelo =
      this.persona.nombre +
      ' ' +
      this.persona.apellido1 +
      ' ' +
      this.persona.apellido2;
    this.servicio.setNombreModelo(nombreModelo);
    console.log(this.verComentarios);
    if(this.verDireccion == false && this.verEmail == false && this.verTelefono == false && this.verRedesSociales == false){
      this.mostrarContacto = false;
    }
    console.log(this.mostrarContacto);
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
              image: '${environment.apiRoot}/contenido/${m.usuarioId}/${e.id}/full',
              thumbImage: '${environment.apiRoot}/contenido/${m.usuarioId}/${e.id}/card',
            });
          } else {
            if (e.video) {
              this.imagenes.push({
                video: '${environment.apiRoot}/videos/${m.usuarioId}/${e.id}-full.mp4',
                posterImage: '${environment.apiRoot}/contenido/${m.usuarioId}/${e.frameVideoId}/card',
              });
            }
          }
        });
      });
  }
}
